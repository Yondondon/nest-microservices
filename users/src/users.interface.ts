import { HttpStatus } from '@nestjs/common';

export interface IBasicResponse<T> {
  status: HttpStatus;
  data?: T;
  message?: string;
}

export interface IUser {
  name: string;
  password: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}
