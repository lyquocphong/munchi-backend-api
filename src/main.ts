import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  let configService = app.get(ConfigService);
  let appPort = configService.getOrThrow<number>('app.port') as number;
  let appName = configService.getOrThrow<string>('app.name') as string;

  console.log('Welcome to', appName);

  await app.listen(appPort);
}
bootstrap();
