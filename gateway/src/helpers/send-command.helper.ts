import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGenericResponse } from '../interface';

export async function sendMicroserviceCommand<T>(
  clientProxy: ClientProxy,
  message: Record<string, string>,
  payload: any,
  expectedStatus: HttpStatus,
): Promise<IGenericResponse<T>> {
  const response: IGenericResponse<T> = await firstValueFrom(
    clientProxy.send(message, payload),
  );

  if (response.status !== expectedStatus) {
    throw new HttpException(
      response.message || '',
      response.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return response;
}
