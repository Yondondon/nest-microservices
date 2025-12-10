import { HttpStatus } from '@nestjs/common';

export interface IGenericResponse<T> {
  status: HttpStatus;
  data: T;
  message?: string;
}

export interface IUser {
  name: string;
  password: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignInResponse {
  userId: string;
  accessToken: string;
}

export interface ISignInData {
  username: string;
  password: string;
}
