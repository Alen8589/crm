import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Department extends Document{
    _id: Types.ObjectId;

    @Prop({required:true})
    name: string;

    @Prop({ref:'Department'})
    parentDepartment: Types.ObjectId;

    @Prop({ref:'Department'})
    subDepartments: Types.ObjectId[];

    @Prop()
    roles: string[];

    @Prop()
    permissions: string[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
