import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
import { ResponseInterceptor } from './response/response.interceptor';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ClientURL1 = process.env.ClientURL1;
  const ClientURL2 = process.env.ClientURL2;

  const corsOptions = {
    credentials: true,
    origin: function (origin: any, callback: any) {
      if (!origin || process.env.NODE_ENV === 'development') {
        callback(null, true);

      } else {
        const allowedOrigins = [ClientURL1, ClientURL2];

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Origin not allowed by CORS'));
        }
      }
    }
  };

  app.use(cors(corsOptions));

  app.setGlobalPrefix('api')
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ,'0.0.0.0');
}
bootstrap();
