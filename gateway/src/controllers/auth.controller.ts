import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClientProxy: ClientProxy,
  ) {}

  @Get()
  async findAll() {
    // return sendMicroserviceCommand<IUser[]>(
    //   this.usersClientProxy,
    //   'findAll',
    //   {},
    //   HttpStatus.OK,
    // );
  }
}
