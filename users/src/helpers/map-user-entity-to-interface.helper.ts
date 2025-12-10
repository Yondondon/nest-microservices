import { IUser } from '../users.interface';
import { UserEntity } from '../entities/user';

export const mapUserEntityToInterface = (userEntity: UserEntity): IUser => {
  return {
    name: userEntity.name,
    password: userEntity.password,
    uuid: userEntity.uuid,
    createdAt: userEntity.createdAt,
    updatedAt: userEntity.updatedAt,
  };
};
