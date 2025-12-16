import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ICreateUserResponse, IUser } from '../interfaces';
import { CreateUserDto } from '../dto';
import { isRpcError } from '../helpers';
import { catchError, firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../guards';
import { PublicRoute } from '../decorators';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await firstValueFrom<IUser[]>(
      this.usersClient.send<IUser[]>({ cmd: 'findAll' }, {}).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            if (err.code.includes('INTERNAL')) {
              throw new InternalServerErrorException(err.message);
            }
            throw new NotFoundException(err.message);
          }
          throw err;
        }),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await firstValueFrom<IUser>(
      this.usersClient.send<IUser>({ cmd: 'findById' }, id).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            if (err.code === 'USER_NOT_FOUND') {
              throw new NotFoundException(err.message);
            }
            throw new InternalServerErrorException(err.message);
          }
          throw err;
        }),
      ),
    );
  }

  @PublicRoute()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await firstValueFrom<ICreateUserResponse>(
      this.usersClient
        .send<ICreateUserResponse>({ cmd: 'create' }, createUserDto)
        .pipe(
          catchError((err) => {
            if (isRpcError(err)) {
              if (err.code === 'USER_EXISTS') {
                throw new ConflictException(err.message);
              }
              throw new InternalServerErrorException(err.message);
            }
            throw err;
          }),
        ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await firstValueFrom<boolean>(
      this.usersClient.send<boolean>({ cmd: 'create' }, id).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            if (err.code === 'USER_NOT_DELETED') {
              throw new NotFoundException(err.message);
            }
            throw new InternalServerErrorException(err.message);
          }
          throw err;
        }),
      ),
    );
  }
}
