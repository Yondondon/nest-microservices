export interface IUser {
  username: string;
  password: string;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginData {
  username: string;
  password: string;
}

export interface RpcError {
  code: string;
  message: string;
}
