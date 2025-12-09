import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'users', port: 3001 },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class GatewayModule {}
