import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { IBasicResponse, IUser } from './users.interface';
import { CreateUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'findAll' })
  async findAll(): Promise<IBasicResponse<IUser[]>> {
    return await this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'findById' })
  async findOne(id: string): Promise<IBasicResponse<IUser>> {
    return await this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'create' })
  async create(
    createUserDto: CreateUserDto,
  ): Promise<IBasicResponse<{ uuid: string }>> {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'delete' })
  async remove(id: string): Promise<IBasicResponse<null>> {
    return await this.usersService.remove(id);
  }
}
