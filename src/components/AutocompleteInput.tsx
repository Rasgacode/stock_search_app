import React, { useRef, useState } from 'react';
import { alphaVantageAxiosGet } from "@/lib/alphaVantageAxios";
import { getCacheFromLocalStorage, saveCacheToLocalStorage } from "@/lib/localStorage";

interface StockMatch {
  ['1. symbol']: string;
  ['2. name']: string;
}

const AutocompleteInput = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const suggestionsToDisplay = response?.bestMatches?.map(
        (match: StockMatch) => (`symbol: ${match['1. symbol']} - company: ${match['2. name']}`)
      );
      cachedSuggestions.push({ key: value, suggestions: suggestionsToDisplay });
      saveCacheToLocalStorage(cachedSuggestions);
      setSuggestions(suggestionsToDisplay);
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
    setInputValue(suggestion);
    setSuggestions([]);
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
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
