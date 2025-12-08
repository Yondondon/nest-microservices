import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user';
import { Repository } from 'typeorm';
import { CreateUserDto, UserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users: UserEntity[] = await this.userRepository.find();

    return users.map((user: UserEntity) => ({
      name: user.name,
      password: user.password,
      uuid: user.uuid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findOne(id: string): Promise<UserDto> {
    const userEntity: UserEntity | null = await this.userRepository.findOne({
      where: { uuid: id },
    });

    if (!userEntity) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    return {
      name: userEntity.name,
      password: userEntity.password,
      uuid: userEntity.uuid,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }

  async create(newUser: CreateUserDto): Promise<string> {
    // const saltOrRounds = 10;
    const userEntity: UserEntity | null = await this.userRepository.findOne({
      where: { name: newUser.name },
    });

    if (userEntity) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // const hash: string = await bcrypt.hash(newUser.password, saltOrRounds);
    const newUserData: Partial<UserEntity> = {
      name: newUser.name,
      password: newUser.password,
      // password: hash,
    };

    const createdUser: UserEntity = await this.userRepository.save(newUserData);
    return createdUser.uuid;
  }

  async remove(uuid: string): Promise<void> {
    const userEntity: UserEntity | null = await this.userRepository.findOne({
      where: { uuid },
    });

    if (!userEntity) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    // TODO: add message to response and try-catch for error cases
    await this.userRepository.remove(userEntity);
  }
}
