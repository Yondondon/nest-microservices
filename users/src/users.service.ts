import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { Repository } from 'typeorm';
import { IUser } from './users.interface';
import { CreateUserDto } from './dto';
import { mapUserEntityToInterface } from './helpers';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<IUser[]> {
    const users = await this.userRepository.find();
    return users.map((user: UserEntity) => mapUserEntityToInterface(user));
  }

  async findOne(uuid: string): Promise<IUser> {
    const userEntity = await this.userRepository.findOne({
      where: { uuid },
    });

    if (!userEntity) {
      throw new RpcException({
        code: 'USER_NOT_FOUND',
        message: 'User with such id does not exist',
      });
    }

    return mapUserEntityToInterface(userEntity);
  }

  async findOneByUsername(username: string): Promise<IUser> {
    const userEntity = await this.userRepository.findOne({
      where: { username },
    });

    if (!userEntity) {
      throw new RpcException({
        code: 'USER_NOT_FOUND',
        message: 'User with such name does not exist',
      });
    }

    return mapUserEntityToInterface(userEntity);
  }

  async create(newUser: CreateUserDto): Promise<{ uuid: string }> {
    const userEntity = await this.userRepository.findOne({
      where: { username: newUser.username },
    });

    if (userEntity) {
      throw new RpcException({
        code: 'USER_EXISTS',
        message: 'User already exists',
      });
    }

    const hash: string = await bcrypt.hash(newUser.password, 10);
    const newUserData: Partial<UserEntity> = {
      username: newUser.username,
      password: hash,
    };
    const createdUser: UserEntity = await this.userRepository.save(newUserData);

    return { uuid: createdUser.uuid };
  }

  async remove(uuid: string): Promise<boolean> {
    const deleteResult = await this.userRepository.delete({ uuid });

    if (deleteResult.affected === 0) {
      throw new RpcException({
        code: 'USER_NOT_DELETED',
        message: 'User is not found',
      });
    }

    return true;
  }
}
