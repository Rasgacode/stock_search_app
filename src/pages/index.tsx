import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AutocompleteInput from "@/components/AutocompleteInput";
import { getFavouritesFromLocalStorage } from "@/lib/localStorage";

const Home = () => {
  const [favourites, setFavourites] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setFavourites(getFavouritesFromLocalStorage() || []);
  }, []);

  const handleFavouriteClick = (symbol: string) => {
    router.push(`/${symbol}`);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="mb-4 text-3xl font-bold">
        Stock Search App
      </div>
      <AutocompleteInput />
      {!!favourites.length && <div className="mt-4 w-10/12 md:w-4/12">
        <h2 className="text-xl font-semibold mb-2">Favourites</h2>
        <ul className="list-disc pl-5">
          {favourites.map((symbol, index) => (
            <li
              key={index}
              onClick={() => handleFavouriteClick(symbol)}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              {symbol}
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
}

export default Home;
