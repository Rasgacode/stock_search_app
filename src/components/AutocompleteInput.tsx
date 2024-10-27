import React, { useRef, useState } from 'react';
import { alphaVantageAxiosGet } from "@/lib/alphaVantageAxios";
import { getCacheFromLocalStorage, saveCacheToLocalStorage } from "@/lib/localStorage";
import { useRouter } from 'next/router';

interface StockMatch {
  ['1. symbol']: string;
  ['2. name']: string;
}

export interface Suggestion {
  symbol: string;
  company: string;
}

const AutocompleteInput = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const fetchSuggestions = async (value: string) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    const cachedSuggestions = getCacheFromLocalStorage() || [];
    if (cachedSuggestions.length) {
      const selectedSuggestions = cachedSuggestions.find((suggestion) => suggestion.key === value);
      if (selectedSuggestions) {
        setSuggestions(selectedSuggestions.suggestions);
        return;
      }
    }

    try {
      const response = await alphaVantageAxiosGet(`/query?function=SYMBOL_SEARCH&keywords=${value}`);
      console.log('response:', response);
      const suggestionsToShow = response?.bestMatches?.map(
        (match: StockMatch) => ({ symbol: match['1. symbol'], company: match['2. name'] })
      );
      cachedSuggestions.push({ key: value, suggestions: suggestionsToShow });
      saveCacheToLocalStorage(cachedSuggestions);
      setSuggestions(suggestionsToShow);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/${suggestion}`);
  };

  return (
    <div className="relative w-10/12 md:w-4/12">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="border rounded-md p-2 w-full"
        placeholder="Type a company name or symbol here..."
      />
      {!!suggestions?.length && (
        <ul className="absolute z-10 bg-white border rounded-md shadow-md mt-1 w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.symbol)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {`symbol: ${suggestion.symbol} - company: ${suggestion.company}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
