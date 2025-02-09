import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account, AccountSchema } from './accounts.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    DatabaseModule
  ],
})
export class AccountsModule {}

