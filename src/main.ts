import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  let configService = app.get(ConfigService);
  let appPort = configService.get<number>('APP_PORT') as number;
  let appName = configService.get<string>('APP_NAME') as string;

  console.log('Welcome to', appName);

  await app.listen(appPort);
}
bootstrap();
