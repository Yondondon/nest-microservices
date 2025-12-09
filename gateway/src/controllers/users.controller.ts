import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUserResponse, IUser } from '../interface';
import { CreateUserDto } from '../dto';
import { sendMicroserviceCommand } from '../helpers';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClientProxy: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return sendMicroserviceCommand<IUser[]>(
      this.usersClientProxy,
      'findAll',
      {},
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return sendMicroserviceCommand<IUser>(
      this.usersClientProxy,
      'findById',
      id,
      HttpStatus.OK,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return sendMicroserviceCommand<ICreateUserResponse>(
      this.usersClientProxy,
      'create',
      createUserDto,
      HttpStatus.CREATED,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return sendMicroserviceCommand<null>(
      this.usersClientProxy,
      'delete',
      id,
      HttpStatus.NO_CONTENT,
    );
  }
}
