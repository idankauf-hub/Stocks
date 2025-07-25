import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService {
  async getQuote(symbol: string) {
    // Mocked data; replace with real API integration later
    return {
      symbol,
      price: 123.45,
      percentChange: 1.23,
      lastUpdated: new Date().toISOString(),
    };
  }
}
