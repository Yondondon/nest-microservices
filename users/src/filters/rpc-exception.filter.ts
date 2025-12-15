import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }
    console.error('Unhandled error in microservice:', exception);

    return super.catch(
      new RpcException({
        code: 'INTERNAL_ERROR',
        message: 'An internal error occurred',
      }),
      host,
    );
  }
}
