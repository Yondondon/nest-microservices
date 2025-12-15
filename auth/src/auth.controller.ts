import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import type { ISignInData, IUser } from './auth.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signIn' })
  async signIn(signInData: ISignInData) {
    return await this.authService.signIn(signInData);
  }

  @MessagePattern({ cmd: 'verifyToken' })
  async verifyToken(token: string) {
    return await this.authService.verifyToken(token);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(userData: {
    username: string;
    password: string;
  }): Promise<IUser | null> {
    return await this.authService.validateUser(
      userData.username,
      userData.password,
    );
  }

  @MessagePattern({ cmd: 'login' })
  async login(userData: IUser) {
    return await this.authService.login(userData);
  }
}
