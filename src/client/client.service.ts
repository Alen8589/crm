import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Client, ClientSchema } from './client.schema';
import { Types } from 'mongoose';

@Injectable()
export class ClientService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }


    async createClient(body: Partial<Client>, companyId: string): Promise<Partial<Client>> {

        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const clientModel = connection.model('Client', ClientSchema)

        const client = await clientModel.create(body)

        if (!client) {
            return null;
        }

        const { _id, name, phone, status } = client

        return { _id, name, phone, status };
    }


    async updateClient(id: string, body: Partial<Client>, companyId: string): Promise<Partial<Client>> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const clientModel = connection.model('Client', ClientSchema)

        const updatedClient = await clientModel.findByIdAndUpdate(id, {
            $set: body
        }, { new: true })

        if (!updatedClient) { return null }

        const { _id, name, phone, status } = updatedClient

        return { _id, name, phone, status };
    }


    async getAllClientsOfACompany(companyId: string): Promise<Client[]> {
        try {
            const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

            const clientModel = connection.model('Client', ClientSchema)
            const clients = await clientModel.find();

            return clients
        } catch (error) {
            console.log(error)
        }
    }

    async getOneClientsOfACompany(companyId: string, userId: string): Promise<Client> {
        try {
            const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

            const clientModel = connection.model('Client', ClientSchema)
            const client = await clientModel.findById(userId);

            return client
        } catch (error) {
            console.log(error)
        }
    }
}
