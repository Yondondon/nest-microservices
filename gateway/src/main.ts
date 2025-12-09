import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    logger: ['error', 'warn'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
