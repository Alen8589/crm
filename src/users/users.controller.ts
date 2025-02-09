import { Body, Controller, HttpStatus, Param, Post,Get, Put, UseGuards } from '@nestjs/common';
import { User } from './users.schema';
import { UsersService } from './users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { EmployeesService } from 'src/employees/employees.service';
import { isValidObjectId } from 'mongoose';
import { ClientService } from 'src/client/client.service';
import { Employee } from 'src/employees/employees.schema';
import { Client } from 'src/client/client.schema';
import { JwtGuard } from 'src/auth/guards/jwt.guard/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard/roles.guard';
import { Roles } from 'src/auth/decoration/roles/roles.deccorator';
import { get } from 'http';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly companyService: CompaniesService,
        private readonly employeesService: EmployeesService,
        private readonly clientService: ClientService,
    ) { }


    @Post('admins')
    async createAdmin(@Body() body: Partial<User>): Promise<APIResponse<Partial<User>>> {

        console.log(`createAdminBody: `, body)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body?.email)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid Email format',
                data: null,
                error: "Invalid Data."
            }
        }

        const mailExists = await this.usersService.doesUserWithMailIdExists(body?.email, null)
        if (mailExists) {
            return {
                statusCode: 409,
                success: false,
                message: 'failed',
                data: null,
                error: 'User with the mail id already exists'
            }
        }

        const userInfoData = {
            email: body?.email,
            password: body?.password,
            roles: ["admin"],
        }

        // Creating admin with credential data for authentication
        const user = await this.usersService.createUser(userInfoData)

        if (!user) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create User'
            }
        }

        // After creating company collection create admin with business data in employees collection

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: user,
            error: null
        }
    }




    @Post('employees')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin', 'hr')
    async createEmployee(@Body() body: Partial<Employee & User>): Promise<APIResponse<Partial<User>>> {

        console.log(`createEmployeeBody: `, body)

        const companyId = body?.companyId;

        if (!isValidObjectId(companyId)) {
            return {
                statusCode: 400,
                success: false,
                message: 'failed',
                data: null,
                error: 'Invalid Company Id'
            }
        }

        const doesCompanyExists = await this.companyService.doesACompanyExists(String(companyId))

        if (!doesCompanyExists) {
            return {
                statusCode: 400,
                success: false,
                message: 'failed',
                data: null,
                error: 'Invalid Company'
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body?.email)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid Email format',
                data: null,
                error: "Invalid Data."
            }
        }

        const mailExists = await this.usersService.doesUserWithMailIdExists(body?.email, null)
        if (mailExists) {
            return {
                statusCode: 409,
                success: false,
                message: 'failed',
                data: null,
                error: 'User with the mail id already exists'
            }
        }


        const userInfoData = {
            email: body?.email,
            password: body?.password,
            roles: body?.roles,
            companyId
        }

        // Creating users with credential data for authentication
        const user = await this.usersService.createUser(userInfoData)

        if (!user) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create User'
            }
        }


        // creating users with business data for employees collection
        const userBody = {
            name: body?.name,
            userId: user?._id
        }

        const employee = await this.employeesService.createEmployee(userBody, user?.companyId)

        if (!employee) {
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create employee'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: user,
            error: null
        }
    }

    @Get('/add-company')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin')
    async create_department() {
        return { message: "Thank you for your request" };
        
    }


    @Post('clients')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('hr')
    async createClient(@Body() body: Partial<Client & User>): Promise<APIResponse<Partial<User>>> {
        console.log(`createClientBody: `, body)

        const companyId = body?.companyId;

        if (!isValidObjectId(companyId)) {
            return {
                statusCode: 400,
                success: false,
                message: 'failed',
                data: null,
                error: 'Invalid Company Id'
            }
        }

        const doesCompanyExists = await this.companyService.doesACompanyExists(String(companyId))

        if (!doesCompanyExists) {
            return {
                statusCode: 400,
                success: false,
                message: 'failed',
                data: null,
                error: 'Invalid Company'
            }
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body?.email)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid Email format',
                data: null,
                error: "Invalid Data."
            }
        }

        const mailExists = await this.usersService.doesUserWithMailIdExists(body?.email, null)
        if (mailExists) {
            return {
                statusCode: 409,
                success: false,
                message: 'failed',
                data: null,
                error: 'User with the mail id already exists'
            }
        }

        const userInfoData = {
            email: body?.email,
            password: body?.password,
            roles: ["client"],
            companyId,
        }

        // Creating users with credential data for authentication
        const user = await this.usersService.createUser(userInfoData)

        if (!user) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create User'
            }
        }

        // creating users with business data into clients and employees collection
        const userBody = {
            name: body?.name,
            userId: user?._id
        }

        const client = await this.clientService.createClient(userBody, String(user?.companyId))

        if (!client) {
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to create client'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: user,
            error: null
        }
    }

    // The updateUser method updates only the credential data part of a User;
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() body: Partial<User>): Promise<APIResponse<Partial<User>>>{
        if (!isValidObjectId(id)) {
            return {
                statusCode: 400,
                success: false,
                message: 'failed',
                data: null,
                error: 'Invalid Id'
            }
        }

        const updatedUser = await this.usersService.updateUser(body, id)

        if(!updatedUser){
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Failed to update user'
            }
        }

        return {
            statusCode: HttpStatus.OK,
            success: true,
            message: 'success',
            data: updatedUser,
            error: null
        }
    }

}
