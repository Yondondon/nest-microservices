import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { Repository } from 'typeorm';
import { IGenericResponse, IUser } from './users.interface';
import { CreateUserDto } from './dto';
import {
  buildErrorResponse,
  buildSuccessResponse,
  handleError,
  mapUserEntityToInterface,
} from './helpers';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<IGenericResponse<IUser[] | null>> {
    try {
      const users = await this.userRepository.find();
      const mappedUsers = users.map((user: UserEntity) =>
        mapUserEntityToInterface(user),
      );

      return buildSuccessResponse(mappedUsers, 'Users are found successfully');
    } catch (error) {
      return handleError(error);
    }
  }

  async findOne(id: string): Promise<IGenericResponse<IUser | null>> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { uuid: id },
      });

      if (!userEntity) {
        return buildErrorResponse(
          'User with such id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return buildSuccessResponse(
        mapUserEntityToInterface(userEntity),
        'User is found successfully',
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async findOneByName(name: string): Promise<IGenericResponse<IUser | null>> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { name },
      });

      if (!userEntity) {
        return buildErrorResponse(
          'User with such name does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return buildSuccessResponse(
        mapUserEntityToInterface(userEntity),
        'User is found successfully',
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async create(
    newUser: CreateUserDto,
  ): Promise<IGenericResponse<{ uuid: string } | null>> {
    try {
      const userEntity = await this.userRepository.findOne({
        where: { name: newUser.name },
      });

      if (userEntity) {
        return buildErrorResponse(
          'Such user already exists',
          HttpStatus.CONFLICT,
        );
      }

      const hash: string = await bcrypt.hash(newUser.password, 10);
      const newUserData: Partial<UserEntity> = {
        name: newUser.name,
        password: hash,
      };
      const createdUser: UserEntity =
        await this.userRepository.save(newUserData);

      return buildSuccessResponse(
        { uuid: createdUser.uuid },
        'User is created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async remove(uuid: string): Promise<IGenericResponse<null>> {
    try {
      const deleteResult = await this.userRepository.delete({ uuid });

      if (deleteResult.affected === 0) {
        return buildErrorResponse(
          'Such user does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      return buildSuccessResponse(
        null,
        'User is deleted successfully',
        HttpStatus.NO_CONTENT,
      );
    } catch (error) {
      return handleError(error);
    }
  }
}
