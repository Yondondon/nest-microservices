import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import type { IGenericResponse, ISignInData } from './auth.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signIn' })
  async signIn(
    signInData: ISignInData,
  ): Promise<IGenericResponse<{ accessToken: string } | null>> {
    return await this.authService.signIn(signInData);
  }

  @MessagePattern({ cmd: 'verifyToken' })
  async verifyToken(token: string) {
    return await this.authService.verifyToken(token);
  }
}
