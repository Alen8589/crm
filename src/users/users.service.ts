import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import { isValidObjectId, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(body: Partial<User>): Promise<Partial<User>> {
        const { password, ...userInfo } = body

        const hashedPwd = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            ...userInfo,
            password: hashedPwd
        })

        const { _id, email, companyId, roles } = user

        return { _id, email, companyId, roles };

    }


    async doesUserWithMailIdExists(email: string, id: string | null): Promise<Boolean> {
        try {
            const filters: { email: string, _id?: any } = { email };
            if (isValidObjectId(id)) {
                filters._id = { $ne: new Types.ObjectId(id) }
            }

            const existingUserMail = await this.userModel.findOne(filters)

            if (existingUserMail) {
                return true
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(body: Partial<User>, userId: string): Promise<Partial<User>> {
        try {

            const userData: Partial<User> = {}

            if(body?.email){
                userData.email = body?.email
            }

            if(body?.roles){
                userData.roles = body?.roles
            }

            if(body?.isActive && typeof body?.isActive === 'boolean'){
                userData.isActive = body?.isActive
            }

            if (body?.companyId && isValidObjectId(body.companyId)) {
                userData.companyId = body?.companyId
            }

            if (body?.password) {
                userData.password = await bcrypt.hash(body?.password, 10)
            }

            console.log({ 'userId': userId })
            console.log({ 'new Types.ObjectId(userId)': new Types.ObjectId(userId) })

            const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
                $set: userData
            }, { new: true }).lean()

            console.log({ updatedUser })

            const { password, ...userInfo } = updatedUser;

            return userInfo as Partial<User>;
        } catch (error) {
            console.log(error)
            return null;
        }
    }



}
