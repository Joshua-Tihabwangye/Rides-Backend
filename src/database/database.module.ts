import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isNeon = process.env.DB_HOST?.includes('neon.tech') || process.env.DATABASE_URL?.includes('neon.tech');
        const useSsl = isNeon || process.env.DB_SSL === 'true';

        return {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
          port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'evzone'),
          password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || 'evzone_dev_pass'),
          database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'evzone'),
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
          entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV === 'development',
        };
      },
    }),
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [SeederService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
