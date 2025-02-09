import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/users.schema';
import { MailService } from './guards/mail.service';


@Module({
  imports:[
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ]),

    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService]
})
export class AuthModule {}
