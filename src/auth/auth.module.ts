import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OrderingCoModule } from 'src/ordering-co/ordering-co.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenStrategy } from './strategy/refreshJwt.strategy';

@Module({
  imports: [OrderingCoModule,JwtModule.register({}), UserModule],
  controllers: [AuthController,RefreshTokenStrategy],
  providers: [AuthService],
})
export class AuthModule {}
