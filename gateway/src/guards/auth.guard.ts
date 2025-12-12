import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest, JwtPayload } from '../interfaces';
import { IS_PUBLIC_KEY } from '../decorators';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceCommand } from '../helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const userInfoResponse = await sendMicroserviceCommand<JwtPayload | null>(
        this.authClient,
        { cmd: 'verifyToken' },
        token,
        HttpStatus.OK,
      );

      if (!userInfoResponse || !userInfoResponse.data) {
        throw new UnauthorizedException();
      }

      request['user'] = userInfoResponse.data;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
