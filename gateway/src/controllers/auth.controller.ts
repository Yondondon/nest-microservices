import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceCommand } from '../helpers';

import { PublicRoute } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @PublicRoute()
  @Post()
  async signIn(@Body() data: { username: string; password: string }) {
    return sendMicroserviceCommand<{ accessToken: string } | null>(
      this.authClient,
      { cmd: 'signIn' },
      { username: data.username, password: data.password },
      HttpStatus.OK,
    );
  }

  // TODO: /me and /signOut routes
}
