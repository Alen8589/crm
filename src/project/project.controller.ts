import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.schema';
import { CreateProjectDto, UpdateProjectDto } from 'src/common/types/project.types';
import { isValidObjectId } from 'mongoose';

interface APIResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T | null;
    error: string;
}

@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService) { }

    @Post()
    async createProject(
        @Body() body: CreateProjectDto
    ): Promise<APIResponse<Partial<Project>>> {
        try {
            const { projectData, companyId } = body;
            if (!isValidObjectId(companyId)) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'invalid id',
                    data: null,
                    error: 'invalid company id'
                }
            }


            const project = await this.projectService.createProject(projectData, companyId)

            if (!project) {
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
                data: project,
                error: null
            }

        } catch (error) {
            console.log(error)
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
    async updateProject(
        @Param('id') id:string,
        @Body() body: UpdateProjectDto
    ): Promise<APIResponse<Partial<Project>>> {
        try {
            const { projectData, companyId } = body;
            if (!isValidObjectId(companyId)) {
                return {
                    statusCode: 400,
                    success: false,
                    message: 'invalid id',
                    data: null,
                    error: 'invalid company id'
                }
            }


            const project = await this.projectService.updateProject(id, projectData, companyId)

            if (!project) {
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
                data: project,
                error: null
            }

        } catch (error) {
            console.log(error)
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Internal server error'
            }
        }
    }


    @Get('companies/:companyId/clients/:clientId')
    async getAllProjectOfAClient(
        @Param('clientId') clientId:string,
        @Param('companyId') companyId:string,
    ): Promise<APIResponse<Partial<Project[]>>> {
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


            const project = await this.projectService.getAllProjectOfAClient(clientId,companyId)

            if (!project) {
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
                data: project,
                error: null
            }

        } catch (error) {
            console.log(error)
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
    async getAllProject(
        @Param('companyId') companyId:string,
    ): Promise<APIResponse<Partial<Project[]>>> {
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


            const project = await this.projectService.getAllProject(companyId)

            if (!project) {
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
                data: project,
                error: null
            }

        } catch (error) {
            console.log(error)
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Internal server error'
            }
        }
    }


    @Get(':id/companies/:companyId')
    async getProject(
        @Param('id') id:string,
        @Param('companyId') companyId:string,
    ): Promise<APIResponse<Partial<Project>>> {
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


            const project = await this.projectService.getProject(id, companyId)

            if (!project) {
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
                data: project,
                error: null
            }

        } catch (error) {
            console.log(error)
            return {
                statusCode: 500,
                success: false,
                message: 'failed',
                data: null,
                error: 'Internal server error'
            }
        }
    }

    @Delete(':id/companies/:companyId')
    async deleteProject(
        @Param('id') id:string,
        @Param('companyId') companyId:string,
    ): Promise<APIResponse<null>> {
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

            const project = await this.projectService.deleteProject(id, companyId)

            if (!project) {
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
            console.log(error)
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
