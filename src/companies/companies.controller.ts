import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Company } from './companies.schema';
import { CompaniesService } from './companies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard/roles.guard';
import { Roles } from 'src/auth/decoration/roles/roles.deccorator';
import { UsersService } from 'src/users/users.service';
import { CreateCompanyDto } from 'src/common/types/company.types';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService,
        private readonly usersService: UsersService
    ) { }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('super_admin', 'admin')
    async createCompany(@Body() body: CreateCompanyDto): Promise<APIResponse<Partial<Company>>> {

        const { companyData, adminId } = body;

        if (!companyData?.companyName?.trim()) {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid name',
                data: null,
                error: "Invalid Data."
            }
        }

        const company = await this.companiesService.createCompany(companyData)

        if (!company) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create Company'
            }
        }

        const updatedAdmin = await this.usersService.updateUser({ companyId: company?._id }, adminId)

        if (!updatedAdmin) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to add company to admin'
            }
        }

        console.log({ 'String(company?._id)': String(company?._id) })
        console.log({ 'String(updatedAdmin?.companyId)': String(updatedAdmin?.companyId) })

        if (String(company?._id) !== String(updatedAdmin?.companyId)) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to add company to admin'
            }
        }

        const { dbName, ...companyInfo } = company

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: companyInfo,
            error: null
        }
    }


    @Put(':id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('super_admin', 'admin')
    async updateCompany(@Param('id') id: string, @Body() companyData: Partial<Company>): Promise<APIResponse<Partial<Company>>> {

        if (!companyData?.companyName?.trim()) {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid name',
                data: null,
                error: "Invalid Data."
            }
        }

        const company = await this.companiesService.updateACompany(id, companyData)

        if (!company) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to update Company'
            }
        }

        const { dbName, ...companyInfo } = company

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: companyInfo,
            error: null
        }
    }


    @Get(':id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('super_admin', 'admin')
    async getACompany(@Param('id') id: string): Promise<APIResponse<Partial<Company>>> {

        const company = await this.companiesService.getACompany(id)

        if (!company) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to fetch Company'
            }
        }

        const { dbName, ...companyInfo } = company

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: companyInfo,
            error: null
        }
    }


    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('super_admin')
    async getAllCompany(): Promise<APIResponse<Partial<Company[]>>> {

        const companies = await this.companiesService.getAllCompany()

        if (!companies) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to fetch Companies'
            }
        }

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: companies,
            error: null
        }
    }
}
