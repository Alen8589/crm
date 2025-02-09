import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Connection, createConnection, Model } from 'mongoose';
import { Company } from 'src/companies/companies.schema';

@Injectable()
export class DatabaseService {
    private connections: { [key: string]: Connection } = {};

    constructor(@InjectModel(Company.name) private companyModel: Model<Company>) { }

    getConnection(dbName: string): Connection {
        if (!this.connections[dbName]) {
            const MONGO_BASE_URL = process.env.MONGO_BASE_URL;

            this.connections[dbName] = createConnection(
                `${MONGO_BASE_URL}/${dbName}`
            )
        }

        return this.connections[dbName];
    }

    async getConnectionFromCompanyId(companyId: string): Promise<Connection> {
        try {
            const company = await this.companyModel.findById(companyId)
            const connection = this.getConnection(company?.dbName)

            return connection
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
