import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';

async function bootstrap() {
  const users = await NestFactory.create(UsersModule, {
    logger: ['error', 'warn'],
  });
  await users.listen(process.env.PORT ?? 3001);
}
void bootstrap();
