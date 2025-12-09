export interface IUser {
  name: string;
  password: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserResponse {
  uuid: string;
}
