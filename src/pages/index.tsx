// import { configCatClient } from "@/lib/configCatClient";
// import axios from "axios";
import AutocompleteInput from "@/components/AutocompleteInput";

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="mb-4 text-3xl font-bold">
        Stock Search App
      </div>
      <AutocompleteInput />
    </div>
  );
}

// interface SSRProps {
//   apiKey: string;
//   data: any;
// }

// export const getServerSideProps = async (): Promise<{ props: SSRProps }> => {
//   const apiKey = await configCatClient.getValueAsync('alphaVantageApiKey', '');
//   const { data } = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&apikey=${apiKey}}`)
//   console.log(data)
//   return { props: { apiKey, data } };
// }

export default Home;
