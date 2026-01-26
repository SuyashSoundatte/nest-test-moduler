import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  );
  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
