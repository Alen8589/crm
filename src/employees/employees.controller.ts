import { Body, Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
import { Employee } from './employees.schema';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from 'src/common/types/user.types';
import { isValidObjectId } from 'mongoose';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('employees')
export class EmployeesController {
    constructor(private employeesService: EmployeesService) { }

    @Put(':id')
    async updateEmployee(
        @Param('id') id: string,
        @Body() updateEmployeeDto: UpdateEmployeeDto
    ): Promise<APIResponse<Partial<Employee>>> {
        const { userData, companyId } = updateEmployeeDto;

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

            const employeeData = {
                name: userData?.name,
                designation: userData?.designation,
                department: userData?.department,
                joinedAt: userData?.joinedAt,
                isActive: userData?.isActive,
            }

            const updatedEmployee = await this.employeesService.updateEmployee(id, employeeData, companyId)

            if (!updatedEmployee) {
                return {
                    statusCode: 500,
                    success: false,
                    message: 'failed',
                    data: null,
                    error: 'Failed to update Employee'
                }
            }

            return {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'success',
                data: updatedEmployee,
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
    async getAllEmployeesOfACompany(
        @Param('companyId') companyId: string
    ): Promise<APIResponse<Partial<Employee[]>>> {

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

            const employees = await this.employeesService.getAllEmployeesOfACompany(companyId)

            if (!employees) {
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
                data: employees,
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


    @Get(':userId/companies/:companyId')
    async getOneEmployeeOfACompany(
        @Param('userId') userId: string, @Param('companyId') companyId: string
    ): Promise<APIResponse<Partial<Employee>>> {

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

            const employee = await this.employeesService.getOneEmployeeOfACompany(companyId, userId)

            if (!employee) {
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
                data: employee,
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
