import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { catchError, firstValueFrom } from 'rxjs';
import { type ILoginData, IUser } from '../auth.interface';
import * as bcrypt from 'bcrypt';
import { isRpcError } from '../helpers';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
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

  async login(user: IUser): Promise<{ accessToken: string }> {
    const payload = { sub: user.uuid, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
