import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      logger: ['error', 'warn'],
      options: { host: '0.0.0.0', port: Number(process.env.PORT) || 3001 },
    },
  );

  await app.listen();
}
void bootstrap();
