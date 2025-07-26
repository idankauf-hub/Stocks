import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const getPortfolio = async (userId: string) => {
  const res = await axios.get(`${BASE_URL}/portfolio/${userId}`);
  return res.data;
};

export const addStock = async (userId: string, symbol: string) => {
  const res = await axios.post(`${BASE_URL}/portfolio/${userId}`, { symbol });
  return res.data;
};

export const removeStock = async (userId: string, symbol: string) => {
  const res = await axios.delete(`${BASE_URL}/portfolio/${userId}/${symbol}`);
  return res.data;
};

export const getStockQuote = async (symbol: string) => {
  const response = await axios.get(`/api/portfolio/quote/${symbol}`);
  return response.data;
};
