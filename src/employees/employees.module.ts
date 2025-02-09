import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './employees.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema }
    ]),
    DatabaseModule
  ],
  exports:[
    EmployeesService,
    MongooseModule
  ]
})
export class EmployeesModule { }
