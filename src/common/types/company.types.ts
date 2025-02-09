import { Company } from "src/companies/companies.schema";

export class CreateCompanyDto {
    companyData: Company;
    adminId: string;
  }