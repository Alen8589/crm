import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/companies/companies.schema';
import { DatabaseService } from './database.service';

@Module({
    imports:[
        MongooseModule.forFeature([
            {name:Company.name, schema: CompanySchema}
        ])
    ],
    exports:[
        MongooseModule,
        DatabaseService
    ],
    providers:[DatabaseService]
})
export class DatabaseModule {}
