import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import type { ILoginData, IUser } from './auth.interface';

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
}
