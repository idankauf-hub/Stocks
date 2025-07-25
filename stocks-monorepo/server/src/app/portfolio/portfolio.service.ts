import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>
  ) {}

  async getPortfolio(userId: string): Promise<PortfolioDocument> {
    let portfolio = await this.portfolioModel.findOne({ userId });
    if (!portfolio) {
      portfolio = new this.portfolioModel({ userId, stocks: [] });
      await portfolio.save();
    }
    return portfolio;
  }

  async addStock(userId: string, symbol: string): Promise<PortfolioDocument> {
    const portfolio = await this.getPortfolio(userId);
    if (!portfolio.stocks.includes(symbol)) {
      portfolio.stocks.push(symbol);
      await (portfolio as any).save();
    }
    return portfolio;
  }

  async removeStock(
    userId: string,
    symbol: string
  ): Promise<PortfolioDocument> {
    const portfolio = await this.getPortfolio(userId);
    portfolio.stocks = portfolio.stocks.filter((s) => s !== symbol);
    await (portfolio as any).save();
    return portfolio;
  }
}
