import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { IGenericResponse, IUser } from './users.interface';
import { CreateUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'findAll' })
  async findAll(): Promise<IGenericResponse<IUser[] | null>> {
    return await this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'findById' })
  async findOne(id: string): Promise<IGenericResponse<IUser | null>> {
    return await this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'findByName' })
  async findOneByName(name: string): Promise<IGenericResponse<IUser | null>> {
    return await this.usersService.findOneByName(name);
  }

  @MessagePattern({ cmd: 'create' })
  async create(
    createUserDto: CreateUserDto,
  ): Promise<IGenericResponse<{ uuid: string } | null>> {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'delete' })
  async remove(id: string): Promise<IGenericResponse<null>> {
    return await this.usersService.remove(id);
  }
}
