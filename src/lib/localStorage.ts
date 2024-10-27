interface Suggestions {
  key: string;
  suggestions: string[];
}

export const saveCacheToLocalStorage = (data: Suggestions[]) => {
  localStorage.setItem('suggestionsCache', JSON.stringify(data));
};

export const getCacheFromLocalStorage = (): Suggestions[] | null => {
  const data = localStorage.getItem('suggestionsCache');
  return data ? JSON.parse(data) : null;
};

export const saveFavouritesToLocalStorage = (data: string[]) => {
  localStorage.setItem('favourites', JSON.stringify(data));
};

export const getFavouritesFromLocalStorage = (): string[] | null => {
  const data = localStorage.getItem('favourites');
  return data ? JSON.parse(data) : null;
};


