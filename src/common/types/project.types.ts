import { Project } from "src/project/project.schema";

export class CreateProjectDto {
    projectData: Project;
    companyId: string;
}

export class UpdateProjectDto {
    projectData: Project;
    companyId: string;
}