import 'dotenv/config';
import { setDefaultResultOrder } from 'node:dns';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/api/http-exception.filter';
import { ApiResponseService } from './common/api/api-response.service';

function parseOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
    ];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const dnsOrder = (process.env.DB_DNS_RESULT_ORDER || 'ipv4first') as Parameters<
    typeof setDefaultResultOrder
  >[0];
  setDefaultResultOrder(dnsOrder);

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const corsOrigins = parseOrigins(process.env.CORS_ORIGINS || process.env.SOCKET_CORS_ORIGINS);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const apiResponse = app.get(ApiResponseService);
  app.useGlobalFilters(new HttpExceptionFilter(apiResponse));

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`EVzone backend listening on http://localhost:${port}/api/v1`);
}

bootstrap();
