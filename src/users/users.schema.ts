import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    companyId: Types.ObjectId | null;

    @Prop()
    roles: string[];

    @Prop({default: true})
    isActive: boolean;

    createdAt: Date;

    @Prop({ required: false })
    resetToken?: string;

    @Prop({ required: false })
    resetTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)