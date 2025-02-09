import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data)=>{
        console.log({data})
        if(data.statusCode){
          response.status(data.statusCode)
        }

        return {
          success: data.success,
          message: data.message,
          data: data.data,
          error: data.error
        }
      })
    );
  }
}
