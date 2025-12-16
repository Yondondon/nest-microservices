import {
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isRpcError } from '../helpers';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import type { AuthenticatedRequest, ILoginResponse } from '../interfaces';
import { catchError, firstValueFrom } from 'rxjs';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Request() req: AuthenticatedRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const loginResponse = await firstValueFrom(
      this.authClient.send<ILoginResponse>({ cmd: 'login' }, req.user).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            throw new InternalServerErrorException(err.message);
          }
          throw err;
        }),
      ),
    );

    res.cookie('refreshToken', loginResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      accessToken: loginResponse.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('refresh')
  async refresh(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new InternalServerErrorException('Refresh token not found');
    }

    const refreshResponse = await firstValueFrom(
      this.authClient
        .send<ILoginResponse>({ cmd: 'refreshToken' }, refreshToken)
        .pipe(
          catchError((err) => {
            if (isRpcError(err)) {
              throw new InternalServerErrorException(err.message);
            }
            throw err;
          }),
        ),
    );

    res.cookie('refreshToken', refreshResponse.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      accessToken: refreshResponse.accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Request() req: AuthenticatedRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    await firstValueFrom(
      this.authClient
        .send<{ success: boolean }>({ cmd: 'logout' }, req.user.sub)
        .pipe(
          catchError((err) => {
            if (isRpcError(err)) {
              throw new InternalServerErrorException(err.message);
            }
            throw err;
          }),
        ),
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
