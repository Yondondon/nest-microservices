import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceCommand } from '../helpers';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import type { AuthenticatedRequest } from '../interfaces';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
    return sendMicroserviceCommand<{ accessToken: string }>(
      this.authClient,
      { cmd: 'login' },
      req.user,
      HttpStatus.OK,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  // TODO: /me and /logout routes
}
