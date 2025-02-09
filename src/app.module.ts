import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesModule } from './companies/companies.module';
import { DatabaseService } from './database/database.service';
import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { ClientModule } from './client/client.module';
import { JwtModule } from '@nestjs/jwt';
import { DepartmentModule } from './department/department.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { AccountsModule } from './accounts/accounts.module';

@Global()
@Module({
  imports: [
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URL),

    CompaniesModule,

    EmployeesModule,

    UsersModule,

    ClientModule,

    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET
    }),

    DepartmentModule,

    DatabaseModule,

    ProjectModule,

    AccountsModule,

  ],
  exports:[JwtModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})

export class AppModule { }
