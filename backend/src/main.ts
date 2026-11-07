import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // transforma los datos recibidos a las instancias de las clases DTO correspondientes.
      whitelist: true, // elimina propiedades que no estén declaradas en el DTO.
      forbidNonWhitelisted: true, // en lugar de eliminarlas silenciosamente, rechaza las peticiones que contienen propiedades no permitidas.
    })
  )

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200',
  });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
