import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import express from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // ---- CSV uploads ------------------------------------------------------
  // Import endpoints accept raw `text/csv` bodies (alongside the JSON
  // `{ "csv": "..." }` wrapper). Parsed to a string, capped at 1 MB.
  app.use(express.text({ type: 'text/csv', limit: '1mb' }));

  // ---- Security headers -------------------------------------------------
  app.use(
    helmet({
      // The API is consumed by first-party web/mobile clients and by the
      // Swagger UI, both of which are served from a different origin.
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // ---- CORS -------------------------------------------------------------
  // `origin: true` reflected any Origin header while also allowing
  // credentials, which is a recipe for CSRF once cookies are introduced.
  const configuredOrigins = config.get<string>('CORS_ORIGINS');
  const allowedOrigins = configuredOrigins
    ? configuredOrigins
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : [];
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 3600,
  });

  // ---- Validation -------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      // Stop large payloads before they are parsed into memory.
      stopAtFirstError: false,
    }),
  );

  // ---- API documentation ------------------------------------------------
  const isProduction = config.get<string>('NODE_ENV') === 'production';
  const swaggerExplicitlyEnabled =
    config.get<string>('SWAGGER_ENABLED')?.toLowerCase() === 'true';
  if (!isProduction || swaggerExplicitlyEnabled) {
    const documentConfig = new DocumentBuilder()
      .setTitle('School SaaS Backend API')
      .setDescription('Multi-tenant school management system API documentation')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addServer(
        `http://localhost:${config.get<number>('PORT') ?? 3000}`,
        'Local',
      )
      .build();
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('api-docs', app, document);
    logger.log(`Swagger UI available at /api-docs`);
  } else {
    logger.log('Swagger UI disabled in production');
  }

  // ---- Shutdown ---------------------------------------------------------
  app.enableShutdownHooks();

  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port);
  logger.log(`Server listening on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
