import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceCommand } from '../helpers';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClientProxy: ClientProxy,
  ) {}

  @Post()
  async signIn(@Body() data: { username: string; password: string }) {
    return sendMicroserviceCommand<{ accessToken: string } | null>(
      this.authClientProxy,
      { cmd: 'signIn' },
      { username: data.username, password: data.password },
      HttpStatus.OK,
    );
  }
}
