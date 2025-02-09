import { Types } from "mongoose";
import { Client } from "src/client/client.schema";
import { Company } from "src/companies/companies.schema";
import { Employee } from "src/employees/employees.schema";
import { User } from "src/users/users.schema";

export type ValidatedUser = {
  _id: Types.ObjectId;
  email: string;
  companyId: Types.ObjectId,
  roles: string[];
}


export class CreateAdminDto {
  companyData: Company;
  userData: User & Employee;
}

export class CreateClientDto {
  companyData: Company;
  userData: User & Client;
}


export class UpdateClientDto {
  userData: User & Client;
  companyId: string;
}

export class UpdateEmployeeDto {
  userData: User & Employee;
  companyId: string;
}


