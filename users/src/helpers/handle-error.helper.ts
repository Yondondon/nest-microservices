import { IGenericResponse } from '../users.interface';
import { HttpStatus } from '@nestjs/common';
import { buildErrorResponse } from './build-error-response.helper';

export const handleError = (error: unknown): IGenericResponse<null> => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return buildErrorResponse(
    errorMessage || 'Unknown error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
