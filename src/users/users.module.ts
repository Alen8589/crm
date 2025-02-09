import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { CompaniesModule } from 'src/companies/companies.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { ClientModule } from 'src/client/client.module';
import { CompaniesService } from 'src/companies/companies.service';
import { Company, CompanySchema } from 'src/companies/companies.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CompaniesService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),

    EmployeesModule,
    ClientModule,
  ]
})
export class UsersModule { }
