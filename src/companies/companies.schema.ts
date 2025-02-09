import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({timestamps:true})
export class Company extends Document {
    _id: Types.ObjectId;

    @Prop({required: true})
    companyName: string;

    @Prop({required: true})
    dbName: string;

    createdAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company)