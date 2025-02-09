import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Account extends Document {
  @Prop({ required: true, enum: ['INCOME', 'EXPENSE'] })
  type: 'INCOME' | 'EXPENSE';

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: new Date() })
  date: Date;

  @Prop({ default: null })
  category: string; 
}

export const AccountSchema = SchemaFactory.createForClass(Account);
