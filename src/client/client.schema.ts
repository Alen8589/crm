import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Client extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    phone: string;

    @Prop()
    status: string;

    createdAt: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client)
