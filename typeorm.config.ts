import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
// Load the environment variables from .env file
config({ path: join(__dirname, './.env') });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('DB_HOST'), // Use the environment variable for the database host
  port: Number(configService.getOrThrow<string>('DB_PORT')), // Use the environment variable for the database port
  username: configService.getOrThrow<string>('DB_USERNAME'), // Use the environment variable for the database username
  password: configService.getOrThrow<string>('DB_PASSWORD'), // Use the environment variable for the database password
  database: configService.getOrThrow<string>('DB_NAME'), // Use the environment variable for the database name
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['migrations/**/*.{ts,js}'],
  synchronize: true,
});
