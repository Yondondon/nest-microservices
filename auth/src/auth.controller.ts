import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { ILoginData, IUser } from './auth.interface';
import { AuthService } from './services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(loginData: ILoginData) {
    return await this.authService.validateUser(loginData);
  }

  @MessagePattern({ cmd: 'login' })
  async login(userData: IUser) {
    return await this.authService.login(userData);
  }

  @MessagePattern({ cmd: 'refreshToken' })
  async refreshToken(refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(userUuid: string) {
    return await this.authService.logout(userUuid);
  }
}
