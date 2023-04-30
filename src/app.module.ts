import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { OrderingCoModule } from './ordering-co/ordering-co.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration],
    }),
    AuthModule,
    OrderingCoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
