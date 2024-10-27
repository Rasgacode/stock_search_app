interface Suggestions {
  key: string;
  suggestions: string[];
}

export const saveCacheToLocalStorage = (key: string, data: Suggestions[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getCacheFromLocalStorage = (key: string): Suggestions[] | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
