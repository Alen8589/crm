import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from '../common/types/accounts.types';
import { isValidObjectId } from 'mongoose';
import { Account } from './accounts.schema';

interface APIResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;
  error: string;
}

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto
  ): Promise<APIResponse<Partial<CreateAccountDto>>> {
    const { companyId, ...createAccountFields } = createAccountDto

    if (!isValidObjectId(companyId)) {
      return {
        statusCode: 400,
        success: false,
        message: 'invalid id',
        data: null,
        error: 'invalid company id'
      }
    }

    try {
      const transaction = await this.accountsService.create(createAccountFields, companyId);

      if (!transaction) {
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
        data: transaction,
        error: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'failed',
        data: null,
        error: 'Internal server error'
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<APIResponse<Partial<UpdateAccountDto>>> {
    const { companyId, ...updateFields } = updateAccountDto

    try {
      if (!isValidObjectId(companyId)) {
        return {
          statusCode: 400,
          success: false,
          message: 'invalid id',
          data: null,
          error: 'invalid company id'
        }
      }

      const updatedTransaction = await this.accountsService.update(id, updateFields, companyId);

      if (!updatedTransaction) {
        return {
          statusCode: 500,
          success: false,
          message: 'failed',
          data: null,
          error: 'Failed to update Department'
        }
      }

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'success',
        data: updatedTransaction,
        error: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'failed',
        data: null,
        error: 'Internal server error'
      }
    }
  }

  @Get('companies/:companyId')
  async findAll(
    @Param('companyId') companyId: string
  ): Promise<APIResponse<Partial<Account[]>>> {
    try {
      if (!isValidObjectId(companyId)) {
        return {
          statusCode: 400,
          success: false,
          message: 'invalid id',
          data: null,
          error: 'invalid company id'
        }
      }
      const transactions = await this.accountsService.findAll(companyId);

      if (!transactions) {
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
        data: transactions,
        error: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'failed',
        data: null,
        error: 'Internal server error'
      }
    }
  }

  @Get(':accountsId/companies/:companyId')
  async findOne(
    @Param('accountsId') accountsId: string, @Param('companyId') companyId: string
  ): Promise<APIResponse<Partial<Account>>> {
    try {
      if (!isValidObjectId(companyId)) {
        return {
          statusCode: 400,
          success: false,
          message: 'invalid id',
          data: null,
          error: 'invalid company id'
        }
      }

      const transaction = await this.accountsService.findOne(companyId, accountsId);

      if (!transaction) {
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
        data: transaction,
        error: null
      }

    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'failed',
        data: null,
        error: 'Internal server error'
      }
    }
  }



  @Delete(':accountsId/companies/:companyId')
  async remove(
    @Param('accountsId') accountsId: string,
    @Param('companyId') companyId: string,
  ): Promise<APIResponse<void>> {

    try {
      if (!isValidObjectId(companyId)) {
        return {
          statusCode: 400,
          success: false,
          message: 'invalid id',
          data: null,
          error: 'invalid company id'
        }
      }

      const transaction = await this.accountsService.remove(companyId, accountsId);

      if (!transaction) {
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
        data: null,
        error: null
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: 'failed',
        data: null,
        error: 'Internal server error'
      }
    }
  }
}

