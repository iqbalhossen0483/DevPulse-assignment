import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { errorResponse } from './utils/response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'authorization' },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`DevPulse running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}
void bootstrap();
