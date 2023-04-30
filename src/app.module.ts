import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/validation';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validate,
    load: [configuration]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
