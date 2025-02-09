import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Employee extends Document {
    _id: Types.ObjectId;

    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    designation: string;

    @Prop()
    department: Types.ObjectId;

    @Prop()
    joinedAt: Date;

    @Prop({default: true})
    isActive: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);