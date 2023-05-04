import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './auth/auth.module';
import { OrderingCoModule } from './ordering-co/ordering-co.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { DeliveryModule } from './delivery/delivery.module';
import { MessagingModule } from './messaging/messaging.module';
import { BusinessModule } from './business/business.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration],
      expandVariables: true,
    }),
    PrismaModule,
    AuthModule,
    OrderingCoModule,
    UserModule,
    DeliveryModule,
    MessagingModule,
    BusinessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
