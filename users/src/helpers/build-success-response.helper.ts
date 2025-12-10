import { IGenericResponse } from '../users.interface';
import { HttpStatus } from '@nestjs/common';

export const buildSuccessResponse = <T>(
  data: T,
  message: string,
  status: HttpStatus = HttpStatus.OK,
): IGenericResponse<T> => {
  return {
    status,
    data,
    message,
  };
};
