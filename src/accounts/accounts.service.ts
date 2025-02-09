import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, AccountSchema } from './accounts.schema';
import { CreateAccountDto, UpdateAccountDto } from '../common/types/accounts.types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AccountsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async create(createAccountDto: CreateAccountDto, companyId: string): Promise<Account> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const accountsModel = connection.model(Account.name, AccountSchema)

        const transaction = await accountsModel.create(createAccountDto)

        if (!transaction) {
            return null;
        }

        return transaction;
    }


    async update(
        id: string,
        updateAccountDto: UpdateAccountDto,
        companyId: string
    ): Promise<Account> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const accountsModel = connection.model(Account.name, AccountSchema)

        const updatedTransaction = await accountsModel.findByIdAndUpdate(id, {
            $set: updateAccountDto
        }, { new: true })

        if (!updatedTransaction) { return null }

        return updatedTransaction

    }

    async findAll(companyId: string): Promise<Account[]> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const accountsModel = connection.model(Account.name, AccountSchema)

        const transactions = await accountsModel.find();

        return transactions
    }

    async findOne(companyId: string, id: string): Promise<Account> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const accountsModel = connection.model(Account.name, AccountSchema)

        const transaction = await accountsModel.findById(id)

        return transaction
    }

    async remove(companyId: string, id: string): Promise<Account> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const accountsModel = connection.model(Account.name, AccountSchema)

        const transaction = await accountsModel.findByIdAndDelete(id)

        if(!transaction){
            return null
        }

        return transaction
    }
}

