import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

@Injectable()
export class StockService {
  private readonly API_KEY = process.env.FMP_API_KEY;
  private readonly BASE_URL = 'https://financialmodelingprep.com/api/v3';

  private readonly cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 1000 * 60 * 5; // 5 minutes cache

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, value: T) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  async searchStocks(query: string) {
    const cacheKey = `search-${query.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.BASE_URL}/search?query=${query}&limit=10&exchange=NASDAQ&apikey=${this.API_KEY}`;
      const { data } = await axios.get(url);

      const results = data.map((item) => ({
        symbol: item.symbol,
        name: item.name,
      }));

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to search stocks.' },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getQuote(symbol: string) {
    const cacheKey = `quote-${symbol.toUpperCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.BASE_URL}/quote/${symbol}?apikey=${this.API_KEY}`;
      const response = await axios.get(url);
      const quote = response.data?.[0];

      if (!quote) {
        throw new HttpException(
          { message: `No data found for symbol "${symbol}".` },
          HttpStatus.NOT_FOUND
        );
      }

      const result = {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercentage: quote.changesPercentage,
        volume: quote.volume,
        dayLow: quote.dayLow,
        dayHigh: quote.dayHigh,
        yearHigh: quote.yearHigh,
        yearLow: quote.yearLow,
        marketCap: quote.marketCap,
        priceAvg50: quote.priceAvg50,
        priceAvg200: quote.priceAvg200,
        exchange: quote.exchange,
        open: quote.open,
        previousClose: quote.previousClose,
        timestamp: quote.timestamp,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error: any) {
      throw new HttpException(
        { message: 'Failed to fetch quote.' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
