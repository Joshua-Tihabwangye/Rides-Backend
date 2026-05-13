import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const isNeon = process.env.DB_HOST?.includes('neon.tech') || process.env.DATABASE_URL?.includes('neon.tech');
const useSsl = isNeon || process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'evzone'),
  password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'evzone_dev_pass'),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'evzone'),
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  entities: [join(__dirname, 'src', 'entities', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'src', 'database', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  logging: true,
});
