import {
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isRpcError } from '../helpers';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import type { AuthenticatedRequest } from '../interfaces';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return await firstValueFrom(
      this.authClient
        .send<{ accessToken: string }>({ cmd: 'login' }, req.user)
        .pipe(
          catchError((err) => {
            if (isRpcError(err)) {
              throw new InternalServerErrorException(err.message);
            }
            throw err;
          }),
        ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  // TODO: refresh token logic and logout
}
