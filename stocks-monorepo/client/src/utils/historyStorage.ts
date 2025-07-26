const HISTORY_KEY = 'viewedStocks';

export const getViewedStocks = (): string[] => {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const addViewedStock = (symbol: string) => {
  const current = getViewedStocks().filter((s) => s !== symbol);
  current.unshift(symbol);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(current.slice(0, 10)));
};

export const removeViewedStock = (symbol: string) => {
  const current = getViewedStocks().filter((s) => s !== symbol);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
};
