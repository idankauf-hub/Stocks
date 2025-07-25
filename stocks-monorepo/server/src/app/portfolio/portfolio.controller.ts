import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { AddStockDto } from './dto';
import { StockService } from './stock.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly stockService: StockService
  ) {}

  @Get(':userId')
  getPortfolio(@Param('userId') userId: string) {
    return this.portfolioService.getPortfolio(userId);
  }

  @Post(':userId')
  addStock(@Param('userId') userId: string, @Body() dto: AddStockDto) {
    return this.portfolioService.addStock(userId, dto.symbol);
  }

  @Delete(':userId/:symbol')
  removeStock(
    @Param('userId') userId: string,
    @Param('symbol') symbol: string
  ) {
    return this.portfolioService.removeStock(userId, symbol);
  }

  @Get('quote/:symbol')
  getStockQuote(@Param('symbol') symbol: string) {
    return this.stockService.getQuote(symbol);
  }
}
