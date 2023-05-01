import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { OrderingCoModule } from './ordering-co/ordering-co.module';
import { DeliveryModule } from './delivery/delivery.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration],
      expandVariables: true,
    }),
    AuthModule,
    OrderingCoModule,
    DeliveryModule,
    MessagingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
