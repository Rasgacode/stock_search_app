import React from 'react';
import { GetServerSidePropsContext } from "next";
import { alphaVantageAxiosGet } from "@/lib/alphaVantageAxios";

interface StockDetailsProps {
  symbol: string;
  stockDetails: { label: string; value: string }[];
}

const Details = ({ symbol, stockDetails }: StockDetailsProps) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">{symbol}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {stockDetails?.map((detail, index) => (
          <div key={index} className="p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{detail.label}</h2>
            <p className="text-lg">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context;
  const symbol = params?.symbol;

  if (symbol) {
    const response = await alphaVantageAxiosGet(`/query?function=GLOBAL_QUOTE&symbol=${symbol}`);
    //TODO: remove mocked quote here
    const data = response['Global Quote'] || {
      '01. symbol': 'IBM',
      '02. open': '216.8000',
      '03. high': '218.6500',
      '04. low': '214.3850',
      '05. price': '214.6700',
      '06. volume': '8482235',
      '07. latest trading day': '2024-10-25',
      '08. previous close': '218.3900',
      '09. change': '-3.7200',
      '10. change percent': '-1.7034%'
    };

    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const stockDetails = [
      { label: 'Open', value: data['02. open'] },
      { label: 'High', value: data['03. high'] },
      { label: 'Low', value: data['04. low'] },
      { label: 'Current Price', value: data['05. price'] },
      { label: 'Volume', value: data['06. volume'] },
      { label: 'Latest Trading Day', value: data['07. latest trading day'] },
      { label: 'Previous Close', value: data['08. previous close'] },
      { label: 'Change', value: data['09. change'] },
      { label: 'Change Percent', value: data['10. change percent'] },
    ];

    return {
      props: {
        symbol: data['01. symbol'],
        stockDetails: stockDetails
      },
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default Details;
