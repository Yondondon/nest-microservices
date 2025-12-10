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
    console.log(signInData);
    return await this.authService.signIn(signInData);
  }
}
