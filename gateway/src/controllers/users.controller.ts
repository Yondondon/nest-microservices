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
import { ICreateUserResponse, IUser } from '../interfaces';
import { CreateUserDto } from '../dto';
import { sendMicroserviceCommand } from '../helpers';
import { PublicRoute } from '../decorators';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    return sendMicroserviceCommand<IUser[]>(
      this.usersClient,
      { cmd: 'findAll' },
      {},
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return sendMicroserviceCommand<IUser>(
      this.usersClient,
      { cmd: 'findById' },
      id,
      HttpStatus.OK,
    );
  }

  @PublicRoute()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return sendMicroserviceCommand<ICreateUserResponse>(
      this.usersClient,
      { cmd: 'create' },
      createUserDto,
      HttpStatus.CREATED,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return sendMicroserviceCommand<null>(
      this.usersClient,
      { cmd: 'delete' },
      id,
      HttpStatus.NO_CONTENT,
    );
  }
}
