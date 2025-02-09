import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './client.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService], 
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema }
    ]),
    DatabaseModule
  ],

  exports:[
    ClientService,
    MongooseModule
  ]
})
export class ClientModule { }
