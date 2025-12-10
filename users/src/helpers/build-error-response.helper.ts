import { HttpStatus } from '@nestjs/common';
import { IGenericResponse } from '../users.interface';

export const buildErrorResponse = (
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
): IGenericResponse<null> => {
  return {
    status,
    data: null,
    message,
  };
};
