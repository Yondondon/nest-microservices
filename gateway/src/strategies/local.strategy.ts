import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { IUser } from '../interfaces';
import { isRpcError } from '../helpers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_CLIENT') private readonly authClient: ClientProxy) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userData = { username, password };
    return await firstValueFrom(
      this.authClient.send<IUser>({ cmd: 'validateUser' }, userData).pipe(
        catchError((err) => {
          if (isRpcError(err)) {
            if (err.code.startsWith('AUTH_') || err.code.startsWith('USER_')) {
              throw new UnauthorizedException(err.message);
            }
            throw new InternalServerErrorException(
              'Unauthorized. Error occurred during authentication',
            );
          }
          throw err;
        }),
      ),
    );
  }
}
