import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema()
export class Portfolio {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: [String], default: [] })
  stocks: string[];
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
