import { Department } from "src/department/department.schema";

export class CreateDepartmentDto {
    departmentData: Department;
    companyId: string;
}

export class DepartmentDto {
    departmentData: Department;
    companyId: string;
}