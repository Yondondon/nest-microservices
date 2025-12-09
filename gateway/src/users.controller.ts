import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClientProxy: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return this.usersClientProxy.send({ cmd: 'findAll' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClientProxy.send({ cmd: 'findById' }, id);
  }
}
