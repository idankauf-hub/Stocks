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

  async getPortfolio(email: string): Promise<PortfolioDocument> {
    let p = await this.portfolioModel.findOne({ userEmail: email });
    if (!p) {
      p = new this.portfolioModel({ userEmail: email, stocks: [] });
      await p.save();
    }
    return p;
  }

  async addStock(
    userEmail: string,
    symbol: string
  ): Promise<PortfolioDocument> {
    const portfolio = await this.getPortfolio(userEmail);
    if (!portfolio.stocks.includes(symbol)) {
      portfolio.stocks.push(symbol);
      await portfolio.save();
    }
    return portfolio;
  }

  async removeStock(
    userId: string,
    symbol: string
  ): Promise<PortfolioDocument> {
    const portfolio = await this.getPortfolio(userId);
    portfolio.stocks = portfolio.stocks.filter((s) => s !== symbol);
    await portfolio.save();
    return portfolio;
  }
}
