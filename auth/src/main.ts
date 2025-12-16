import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { AllExceptionsFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      logger: ['error', 'warn'],
      options: { host: '0.0.0.0', port: Number(process.env.PORT) || 5002 },
    },
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen();
}
void bootstrap();
