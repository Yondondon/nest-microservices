export interface IBasicResponse<T> {
  success: boolean;
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
