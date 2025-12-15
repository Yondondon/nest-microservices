import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IUser } from '../interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_CLIENT') private readonly authClient: ClientProxy) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userData = { username, password };
    const userResponse: IUser | null = await firstValueFrom<IUser | null>(
      this.authClient.send({ cmd: 'validateUser' }, userData),
    );

    if (!userResponse) {
      throw new UnauthorizedException();
    }

    return userResponse;
  }
}
