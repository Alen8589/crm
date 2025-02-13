import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['Planned', 'In Progress', 'Completed', 'On Hold', 'Cancelled'], default: 'Planned' })
  status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 0 })
  budget: number;

  @Prop([{ type: Types.ObjectId, ref: 'Account' }])
  linkedAccounts: Types.ObjectId[]; 

  @Prop({ type: Types.ObjectId })
  client: Types.ObjectId; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

