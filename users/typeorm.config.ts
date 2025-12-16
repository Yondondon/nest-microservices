import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: 'localhost', // hardcoded 'localhost' because typeorm cli works outside docker container
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entities/**/*.entity{.ts,.ts}'],
  migrations: ['src/database/migrations/*.ts'],
});
