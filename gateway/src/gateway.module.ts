import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: 'USERS_CLIENT',
        transport: Transport.TCP,
        options: { host: 'users', port: 5001 },
      },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: { host: 'auth', port: 5002 },
      },
    ]),
  ],
  controllers: [UsersController, AuthController],
  providers: [LocalStrategy, JwtStrategy],
})
export class GatewayModule {}
