import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, DepartmentDto } from 'src/common/types/department.types';
import { Department } from './department.schema';
import { isValidObjectId } from 'mongoose';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('departments')
export class DepartmentController {
    constructor(private departmentService: DepartmentService) { }

    @Post()
    async createDepartment(
        @Body() body: CreateDepartmentDto
    ): Promise<APIResponse<Partial<Department>>> {
        const { departmentData, companyId } = body;

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
            const department = await this.departmentService.createDepartment(departmentData, companyId)

            if (!department) {
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
                data: department,
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
        async updateDepartment(
            @Param('id') id: string,
            @Body() updateDepartmentDto: DepartmentDto
        ): Promise<APIResponse<Partial<Department>>> {
            const { departmentData, companyId } = updateDepartmentDto;
    
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
    
                const DepartmentData = {
                    name: departmentData?.name,
                    parentDepartment: departmentData?.parentDepartment,
                    subDepartments: departmentData?.subDepartments,
                    roles: departmentData?.roles,
                    permissions: departmentData?.permissions,
                }
    
                const updatedDepartment = await this.departmentService.updateDepartment(id, DepartmentData, companyId)
    
                if (!updatedDepartment) {
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
                    data: updatedDepartment,
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
        async getAllDepartmentsOfACompany(
            @Param('companyId') companyId: string
        ): Promise<APIResponse<Partial<Department[]>>> {
    
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
    
                const departments = await this.departmentService.getAllDepartmentsOfACompany(companyId)
    
                if (!departments) {
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
                    data: departments,
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
    
    
        @Get(':deptId/companies/:companyId')
        async getOneDepartmentOfACompany(
            @Param('deptId') deptId: string, @Param('companyId') companyId: string
        ): Promise<APIResponse<Partial<Department>>> {
    
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
    
                const department = await this.departmentService.getOneDepartmentOfACompany(companyId, deptId)
    
                if (!department) {
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
                    data: department,
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
