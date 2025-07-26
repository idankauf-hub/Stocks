import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { StockService } from './stock.service';
import { Public } from '../guards/public.decorator';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly stockService: StockService
  ) {}

  @Public()
  @Get('search/:query')
  searchStocks(@Param('query') query: string) {
    return this.stockService.searchStocks(query);
  }

  @Public()
  @Get('quote/:symbol')
  getStockQuote(@Param('symbol') symbol: string) {
    return this.stockService.getQuote(symbol);
  }

  @Post('add')
  addStock(@Req() req: any, @Body('symbol') symbol: string) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.portfolioService.addStock(userId, symbol);
  }

  @Post('remove')
  removeStock(@Req() req: any, @Body('symbol') symbol: string) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.portfolioService.removeStock(userId, symbol);
  }

  @Get()
  getPortfolio(@Req() req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.portfolioService.getPortfolio(userId);
  }
}
