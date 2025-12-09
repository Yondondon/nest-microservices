import { HttpStatus } from '@nestjs/common';

export interface IGenericResponse<T> {
  status: HttpStatus;
  data?: T;
  message?: string;
}
