import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Project, ProjectSchema } from './project.schema';

@Injectable()
export class ProjectService {
    constructor(private databaseService: DatabaseService) { }

    async createProject(body: Partial<Project>, companyId: string): Promise<Project> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const project = await projectModel.create(body);

        return project
    }

    async updateProject(id: string, body: Partial<Project>, companyId: string): Promise<Project>{
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const project = await projectModel.findByIdAndUpdate(id, { $set: body }, { new: true });

        return project
    }

    async getProject(id: string, companyId: string): Promise<Project> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const project = await projectModel.findById(id);

        return project
    }

    async getAllProject(companyId: string) : Promise<Project[]>{
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const projects = await projectModel.find();

        return projects
    }

    async getAllProjectOfAClient(clientId:string, companyId: string): Promise<Project[]> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const projects = await projectModel.find({client: clientId});

        return projects
    }

    async deleteProject(id: string, companyId: string): Promise<Project> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId)
        const projectModel = connection.model(Project.name, ProjectSchema)

        const project = await projectModel.findByIdAndDelete(id);

        return project
    }

}
