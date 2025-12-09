import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { Repository } from 'typeorm';
import { IBasicResponse, IUser } from './users.interface';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<IBasicResponse<IUser[]>> {
    try {
      const users: UserEntity[] = await this.userRepository.find();
      const mappedUsers: IUser[] = users.map((user: UserEntity) => ({
        name: user.name,
        password: user.password,
        uuid: user.uuid,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return {
        success: true,
        data: mappedUsers,
        message: 'Users are found successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: errorMessage || 'Unknown error',
      };
    }
  }

  async findOne(id: string): Promise<IBasicResponse<IUser>> {
    try {
      const userEntity: UserEntity | null = await this.userRepository.findOne({
        where: { uuid: id },
      });

      if (!userEntity) {
        return {
          success: false,
          message: 'User with such id does not exist',
        };
      }

      return {
        success: true,
        data: {
          name: userEntity.name,
          password: userEntity.password,
          uuid: userEntity.uuid,
          createdAt: userEntity.createdAt,
          updatedAt: userEntity.updatedAt,
        },
        message: 'User is found successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: errorMessage || 'Unknown error',
      };
    }
  }

  async create(
    newUser: CreateUserDto,
  ): Promise<IBasicResponse<{ uuid: string }>> {
    try {
      // const saltOrRounds = 10;
      const userEntity: UserEntity | null = await this.userRepository.findOne({
        where: { name: newUser.name },
      });

      if (userEntity) {
        return {
          success: false,
          message: 'Such user already exists',
        };
      }

      // const hash: string = await bcrypt.hash(newUser.password, saltOrRounds);
      const newUserData: Partial<UserEntity> = {
        name: newUser.name,
        password: newUser.password,
        // password: hash,
      };
      const createdUser: UserEntity =
        await this.userRepository.save(newUserData);

      return {
        success: true,
        data: { uuid: createdUser.uuid },
        message: 'User is created successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: errorMessage || 'Unknown error',
      };
    }
  }

  async remove(uuid: string): Promise<IBasicResponse<null>> {
    try {
      const userEntity: UserEntity | null = await this.userRepository.findOne({
        where: { uuid },
      });

      if (!userEntity) {
        return {
          success: false,
          message: 'Failed to remove user. Such user does not exist',
        };
      }

      await this.userRepository.remove(userEntity);

      return { success: true, message: 'User is deleted successfully' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: errorMessage || 'Unknown error',
      };
    }
  }
}
