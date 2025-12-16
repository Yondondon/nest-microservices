import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom } from 'rxjs';
import {
  type ILoginData,
  ILoginResponse,
  IRefreshTokenResponse,
  IUser,
} from '../auth.interface';
import * as bcrypt from 'bcrypt';
import { isRpcError } from '../helpers';
import { RedisService } from './redis.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(loginData: ILoginData): Promise<IUser> {
    const userResponse = await firstValueFrom(
      this.usersClient
        .send<IUser>({ cmd: 'findByUsername' }, loginData.username)
        .pipe(
          catchError((err) => {
            if (isRpcError(err)) {
              throw new RpcException({
                code: err.code,
                message: err.message,
              });
            }
            throw new RpcException({
              code: 'INTERNAL_ERROR',
              message: 'An error occurred while fetching user',
            });
          }),
        ),
    );

    if (!userResponse) {
      throw new RpcException({
        code: 'AUTH_INVALID_USER',
        message: 'Authentication failed. User not found',
      });
    }

    const isMatch: boolean = await bcrypt.compare(
      loginData.password,
      userResponse.password,
    );

    if (!isMatch) {
      throw new RpcException({
        code: 'AUTH_INCORRECT_CREDENTIALS',
        message: 'Incorrect password',
      });
    }

    return userResponse;
  }

  async login(user: IUser): Promise<ILoginResponse> {
    const payload = { sub: user.uuid, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenKey = `refresh_token:${user.uuid}`;

    await this.redisService.set(
      refreshTokenKey,
      refreshToken,
      Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
    );

    await this.redisService.set(
      `refresh_token_lookup:${refreshToken}`,
      user.uuid,
      Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<IRefreshTokenResponse> {
    const userUuid = await this.redisService.get(
      `refresh_token_lookup:${refreshToken}`,
    );

    if (!userUuid) {
      throw new RpcException({
        code: 'AUTH_INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token',
      });
    }

    const storedToken = await this.redisService.get(
      `refresh_token:${userUuid}`,
    );

    if (storedToken !== refreshToken) {
      throw new RpcException({
        code: 'AUTH_INVALID_REFRESH_TOKEN',
        message: 'Invalid refresh token',
      });
    }

    const userResponse = await firstValueFrom(
      this.usersClient.send<IUser>({ cmd: 'findByUuid' }, userUuid).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            throw new RpcException({
              code: err.code,
              message: err.message,
            });
          }
          throw new RpcException({
            code: 'INTERNAL_ERROR',
            message: 'An error occurred while fetching user',
          });
        }),
      ),
    );

    if (!userResponse) {
      throw new RpcException({
        code: 'AUTH_INVALID_USER',
        message: 'User not found',
      });
    }

    const payload = {
      sub: userResponse.uuid,
      username: userResponse.username,
    };
    const newAccessToken = await this.jwtService.signAsync(payload);
    const newRefreshToken = this.generateRefreshToken();

    await this.redisService.del(`refresh_token_lookup:${refreshToken}`);
    await this.redisService.del(`refresh_token:${userUuid}`);
    await this.redisService.set(
      `refresh_token:${userUuid}`,
      newRefreshToken,
      Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
    );
    await this.redisService.set(
      `refresh_token_lookup:${newRefreshToken}`,
      userUuid,
      Number(process.env.JWT_REFRESH_EXPIRES_IN) || 604800,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userUuid: string): Promise<{ success: true }> {
    const refreshTokenKey = `refresh_token:${userUuid}`;
    const refreshToken = await this.redisService.get(refreshTokenKey);

    if (refreshToken) {
      await this.redisService.del(`refresh_token_lookup:${refreshToken}`);
    }
    await this.redisService.del(refreshTokenKey);

    return { success: true };
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString('hex');
  }
}
