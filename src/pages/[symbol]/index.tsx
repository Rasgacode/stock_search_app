import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from "next";
import { alphaVantageAxiosGet } from "@/lib/alphaVantageAxios";
import { saveFavouritesToLocalStorage, getFavouritesFromLocalStorage } from "@/lib/localStorage";
import StockChart from '@/components/StockChart';

interface StockDetailsProps {
  symbol: string;
  stockDetails: { label: string; value: string }[];
  historicalData: { [key: string]: { [key: string]: string } };
}

const Details = ({ symbol, stockDetails, historicalData }: StockDetailsProps) => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [priceHistory, setPriceHistory] = useState<{ date: string; close: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFavouriteToggle = () => {
    if (favourites.includes(symbol)) {
      const updatedFavourites = favourites.filter((fav: string) => fav !== symbol);
      saveFavouritesToLocalStorage(updatedFavourites);
      setFavourites(updatedFavourites)
    } else {
      const updatedFavourites = [...favourites, symbol]
      saveFavouritesToLocalStorage(updatedFavourites);
      setFavourites(updatedFavourites)
    }
  };

  const handleBackClick = () => {
    router.push('/');
  };

  const fetchPriceHistory = async () => {
    console.log('here')
    setLoading(true);
    try {
      const timeSeries = historicalData;
      const fetchedPriceHistory = timeSeries
        ? Object.keys(timeSeries).map(date => ({
          date,
          close: parseFloat(timeSeries[date]['4. close']),
        })).reverse()
        : [];
      setPriceHistory(fetchedPriceHistory);
    } catch (error) {
      console.error('Error fetching price history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFavourites(getFavouritesFromLocalStorage() || [])
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handleBackClick}
        className="fixed top-4 left-4 p-2 rounded-md bg-blue-500 text-white"
      >
        Search
      </button>
      <h1 className="text-3xl font-bold mb-4">{symbol}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {stockDetails?.map((detail, index) => (
          <div key={index} className="p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{detail.label}</h2>
            <p className="text-lg">{detail.value}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={fetchPriceHistory}
          className="p-2 rounded-md bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Price History'}
        </button>
        <button
          onClick={handleFavouriteToggle}
          className={`p-2 rounded-md ${favourites.includes(symbol) ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {favourites.includes(symbol) ? 'Remove from favourites' : 'Add to favourites'}
        </button>
      </div>
      {priceHistory.length > 0 && <StockChart priceHistory={priceHistory} />}
    </div>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const {params} = context;
  const symbol = params?.symbol;

  if (symbol) {
    const response = await alphaVantageAxiosGet(`/query?function=GLOBAL_QUOTE&symbol=${symbol}`);
    const data = response['Global Quote']

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
