import { HttpStatus } from '@nestjs/common';

export interface IGenericResponse<T> {
  status: HttpStatus;
  data: T;
  message?: string;
}

export interface IUser {
  username: string;
  password: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignInData {
  username: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
}
