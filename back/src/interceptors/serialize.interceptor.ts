import { CallHandler, ExecutionContext, NestInterceptor, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

export interface ClassConstructor {
  new (...args: any[]): {}
}

export class SerializeInterceptor implements NestInterceptor{
  constructor(private dto: ClassConstructor){}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((response: any) => {
        if(!response) throw new NotFoundException('');
        const serializedData =  plainToInstance(this.dto, response.data, { excludeExtraneousValues: true });
        return { success: true, msg: response.msg || 'Success' , data: serializedData };
      })
    )
  }
}