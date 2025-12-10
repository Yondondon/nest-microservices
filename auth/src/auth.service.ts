import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { IGenericResponse, type ISignInData, IUser } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { buildErrorResponse, buildSuccessResponse } from './helpers';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClientProxy: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    signInData: ISignInData,
  ): Promise<IGenericResponse<{ accessToken: string } | null>> {
    console.log('service', signInData.username);
    const userResponse: IGenericResponse<IUser | null> = await firstValueFrom(
      this.usersClientProxy.send({ cmd: 'findByName' }, signInData.username),
    );

    if (!userResponse || !userResponse.data) {
      return buildErrorResponse(
        'Failed to authenticate user',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user: IUser = userResponse.data;
    const isMatch: boolean = await bcrypt.compare(
      signInData.password,
      user.password,
    );

    if (!isMatch) {
      return buildErrorResponse('Passwords incorrect', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.uuid, username: user.name };

    return buildSuccessResponse(
      {
        accessToken: await this.jwtService.signAsync(payload),
      },
      'Authenticated successfully',
      HttpStatus.OK,
    );
  }

  // async signUp(username: string, password: string): Promise<any> {
  //   return await this.usersService.create({ username, password });
  // }
}
