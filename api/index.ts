import 'reflect-metadata';
import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { errorResponse } from '../src/utils/response';

let cachedApp: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errorResponse('Validation failed', errors)),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('DevPulse API')
    .setDescription('Internal tech issue & feature tracker API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'authorization' }, 'token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cachedApp = server;
  return server;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const app = await bootstrap();
  app(req, res);
};
