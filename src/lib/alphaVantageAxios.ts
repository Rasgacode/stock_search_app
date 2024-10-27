import axios from 'axios';
import { configCatClient } from "@/lib/configCatClient";

export const alphaVantageAxiosGet = async (query: string) => {
  const apiKey = await configCatClient.getValueAsync('alphaVantageApiKey', '');
  if (!apiKey) {
    throw new Error('API key not found');
  }
  console.log(`${process.env.NEXT_PUBLIC_BASE_ALPHA_VANTAGE_URL}${query}&apikey=${apiKey}`)
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ALPHA_VANTAGE_URL}${query}&apikey=${apiKey}`);
  return data
}
