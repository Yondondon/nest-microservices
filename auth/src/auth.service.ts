import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import {
  IGenericResponse,
  type ISignInData,
  IUser,
  JwtPayload,
} from './auth.interface';
import * as bcrypt from 'bcrypt';
import { buildErrorResponse, buildSuccessResponse } from './helpers';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    signInData: ISignInData,
  ): Promise<IGenericResponse<{ accessToken: string } | null>> {
    const userResponse: IGenericResponse<IUser | null> = await firstValueFrom(
      this.usersClient.send({ cmd: 'findByUsername' }, signInData.username),
    );

    if (!userResponse || !userResponse.data) {
      return buildErrorResponse(
        userResponse.message || 'Failed to authenticate user',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: IUser = userResponse.data;
    const isMatch: boolean = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (!isMatch) {
      return buildErrorResponse('Incorrect password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.uuid, username: user.username };

    return buildSuccessResponse(
      {
        accessToken: await this.jwtService.signAsync(payload),
      },
      'Authenticated successfully',
      HttpStatus.OK,
    );
  }

  async verifyToken(
    token: string,
  ): Promise<IGenericResponse<JwtPayload | null>> {
    try {
      const tokenInfo = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      return buildSuccessResponse(
        tokenInfo,
        'Token is verified',
        HttpStatus.OK,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return buildErrorResponse('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  // async signUp(username: string, password: string): Promise<any> {
  //   return await this.usersService.create({ username, password });
  // }
}
