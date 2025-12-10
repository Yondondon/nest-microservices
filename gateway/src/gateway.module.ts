import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_CLIENT',
        transport: Transport.TCP,
        options: { host: 'users', port: 3001 },
      },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: { host: 'auth', port: 3002 },
      },
    ]),
  ],
  controllers: [UsersController, AuthController],
  providers: [],
})
export class GatewayModule {}
