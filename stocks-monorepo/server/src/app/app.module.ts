import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI || 'mongodb://localhost/portfolio'
    // ),
    // PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
