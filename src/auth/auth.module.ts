import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OrderingCoModule } from 'src/ordering-co/ordering-co.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenStrategy } from './strategy/refreshJwt.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionService } from './session.service';

@Module({
  imports: [OrderingCoModule,JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [AuthService,RefreshTokenStrategy,JwtStrategy,SessionService],
  exports:[SessionService, AuthService]
})
export class AuthModule {}
