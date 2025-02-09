import { Body, Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
import { UpdateClientDto } from 'src/common/types/user.types';
import { ClientService } from './client.service';
import { Client } from './client.schema';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('client')
export class ClientController {
    constructor(
        private clientService: ClientService,
    ) { }

    @Put(':id')
    async updateClient(
        @Param('id') id: string,
        @Body() updateClientDto: UpdateClientDto
    ): Promise<APIResponse<Partial<Client>>> {

        const { userData, companyId } = updateClientDto;

        const clientData = {
            name: userData?.name,
            phone: userData?.phone,
            status: userData?.status
        }

        const updatedClient = await this.clientService.updateClient(id, clientData, companyId)

        if (!updatedClient) {
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to update client'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: updatedClient,
            error: null
        }
    }

    @Get('companies/:companyId')
    async getAllClientsOfACompany(
        @Param('companyId') companyId: string
    ): Promise<APIResponse<Partial<Client[]>>> {
        const clients = await this.clientService.getAllClientsOfACompany(companyId)

        if (!clients) {
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Internal server error'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: clients,
            error: null
        }
    }


    @Get(':userId/companies/:companyId')
    async getOneClientOfACompany(
        @Param('userId') userId: string, @Param('companyId') companyId: string
    ): Promise<APIResponse<Partial<Client>>> {
        const client = await this.clientService.getOneClientsOfACompany(companyId, userId)

        if (!client) {
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Internal server error'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: client,
            error: null
        }
    }
}
