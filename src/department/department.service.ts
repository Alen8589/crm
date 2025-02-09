import { Injectable } from '@nestjs/common';
import { Department, DepartmentSchema } from './department.schema';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DepartmentService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createDepartment(body: Partial<Department>, companyId: string): Promise<Partial<Department>> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);
        const departmentModel = connection.model(Department.name, DepartmentSchema)

        const department = await departmentModel.create(body)

        if (!department) {
            return null;
        }

        return department;
    }

    async updateDepartment(id: string, body: Partial<Department>, companyId: string): Promise<Partial<Department>> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const departmentModel = connection.model('Department', DepartmentSchema)

        const updatedDepartment = await departmentModel.findByIdAndUpdate(id, {
            $set: body
        }, { new: true })

        if (!updatedDepartment) { return null }

        const { _id, name, parentDepartment, subDepartments, roles, permissions } = updatedDepartment

        return { _id, name, parentDepartment, subDepartments, roles, permissions };
    }


    async getAllDepartmentsOfACompany(companyId: string): Promise<Department[]> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const departmentModel = connection.model('Department', DepartmentSchema)
        const departments = await departmentModel.find();

        return departments

    }

    async getOneDepartmentOfACompany(companyId: string, deptId: string): Promise<Department> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const departmentModel = connection.model('Department', DepartmentSchema)
        const department = await departmentModel.findById(deptId);

        return department

    }

}
