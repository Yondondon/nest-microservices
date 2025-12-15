import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'findAll' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'findById' })
  async findOne(id: string) {
    return await this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'findByUsername' })
  async findOneByUsername(username: string) {
    return await this.usersService.findOneByUsername(username);
  }

  @MessagePattern({ cmd: 'create' })
  async create(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'delete' })
  async remove(id: string) {
    return await this.usersService.remove(id);
  }
}
