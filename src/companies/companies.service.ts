import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './companies.schema';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class CompaniesService {
    constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

    generateDatabaseName(companyName: string): string {
        const slug = companyName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 5);
        const uniqueId = crypto.randomBytes(4).toString('hex');
        return `crm_${slug}_${uniqueId}`;
    }


    async createCompany(body: Partial<Company>): Promise<Company> {
        const dbName = this.generateDatabaseName(body?.companyName);
        const company = (await this.companyModel.create({ ...body, dbName }))?.toObject()
        return company
    }

    async doesACompanyExists(id: string): Promise<Boolean> {
        const company = await this.companyModel.findById(new Types.ObjectId(id))

        if (company) {
            return true
        }
        else {
            return false
        }
    }

    async getACompany(id: string): Promise<Partial<Company>> {
        console.log({ id })
        const company = await this.companyModel.findById(new Types.ObjectId(id))
        return company;
    }

    async getAllCompany(): Promise<Partial<Company[]>> {
        const companies = await this.companyModel.find()
        return companies;
    }

    async updateACompany(id: string, companyData: Partial<Company>): Promise<Partial<Company>> {

        const updatedCompany = await this.companyModel.findByIdAndUpdate(id, {
            $set: companyData
        }, { new: true })

        return updatedCompany;
    }
}