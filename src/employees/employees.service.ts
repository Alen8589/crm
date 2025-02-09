import { Injectable } from '@nestjs/common';
import { Employee, EmployeeSchema } from './employees.schema';
import { DatabaseService } from 'src/database/database.service';
import { Types } from 'mongoose';

@Injectable()
export class EmployeesService {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    async createEmployee(body: Partial<Employee>, companyId: Types.ObjectId): Promise<Partial<Employee>> {

        const connection = await this.databaseService.getConnectionFromCompanyId(String(companyId));

        const employeeModel = connection.model('Employee', EmployeeSchema)

        const employee = await employeeModel.create(body)

        if (!employee) {
            return null;
        }

        const { _id, name, designation, department, joinedAt } = employee

        return { _id, name, designation, department, joinedAt };
    }


    async updateEmployee(id: string, body: Partial<Employee>, companyId: string): Promise<Partial<Employee>> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const employeeModel = connection.model('Employee', EmployeeSchema)

        const updatedEmployee = await employeeModel.findByIdAndUpdate(id, {
            $set: body
        }, { new: true })

        if (!updatedEmployee) { return null }

        const { _id, name, designation, department, joinedAt } = updatedEmployee

        return { _id, name, designation, department, joinedAt };
    }


    async getAllEmployeesOfACompany(companyId: string): Promise<Employee[]> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const employeeModel = connection.model('Employee', EmployeeSchema)
        const employees = await employeeModel.find();

        return employees

    }

    async getOneEmployeeOfACompany(companyId: string, userId: string): Promise<Employee> {
        const connection = await this.databaseService.getConnectionFromCompanyId(companyId);

        const employeeModel = connection.model('Employee', EmployeeSchema)
        const employee = await employeeModel.findById(userId);

        return employee

    }
}
