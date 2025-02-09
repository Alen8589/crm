import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './companies.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Company.name, schema: CompanySchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [CompaniesService, UsersService],
    controllers: [CompaniesController],
    exports: [
        CompaniesService, MongooseModule
    ]
})
export class CompaniesModule { }
