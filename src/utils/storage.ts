export const getItem = (key: string): any => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setItem = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const getCategory = (key: string): string[] | null => {
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  }
  return null;
};

export const setCategory = (key: string, value: string[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};