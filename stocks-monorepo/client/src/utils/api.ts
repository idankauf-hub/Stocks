import axios from 'axios';
import { Quote } from '../../../shared/types/quote';

const API_BASE = '/api/portfolio';

const AUTH_HEADER = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchQuote = async (symbol: string): Promise<Quote> => {
  const { data } = await axios.get(`${API_BASE}/quote/${symbol}`);
  return data;
};

export const searchStocks = async (query: string) => {
  const { data } = await axios.get(`${API_BASE}/search/${query}`);
  return data;
};

export const getPortfolio = async () => {
  const { data } = await axios.get(API_BASE, { headers: AUTH_HEADER() });
  return data;
};

export const addToPortfolio = async (symbol: string) => {
  const { data } = await axios.post(
    `${API_BASE}/add`,
    { symbol },
    { headers: AUTH_HEADER() }
  );
  return data;
};

export const removeFromPortfolio = async (symbol: string) => {
  const { data } = await axios.post(
    `${API_BASE}/remove`,
    { symbol },
    { headers: AUTH_HEADER() }
  );
  return data;
};
