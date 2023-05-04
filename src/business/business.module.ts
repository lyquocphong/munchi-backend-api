import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { OrderingCoModule } from 'src/ordering-co/ordering-co.module';

@Module({
  imports: [AuthModule,UserModule,OrderingCoModule],
  controllers: [BusinessController],
  providers: [BusinessService, JwtStrategy]
})
export class BusinessModule {}
