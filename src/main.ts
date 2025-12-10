import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // <--- IMPORTANTE: Activa la conversión automática
      transformOptions: {
        enableImplicitConversion: true, // <--- Ayuda a convertir tipos primitivos
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Sistema de Ventas')
    .setDescription(
      'Documentación de la API para gestión de productos, ventas y usuarios.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  logger.log('🚀 Swagger iniciado en: http://localhost:4000/api');
}
bootstrap();