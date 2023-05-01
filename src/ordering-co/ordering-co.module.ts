import { Global, Module } from '@nestjs/common';
import { OrderingCoController } from './ordering-co.controller';
import { OrderingCoService } from './ordering-co.service';

@Module({
  controllers: [OrderingCoController],
  providers: [OrderingCoService],
  exports: [OrderingCoService]
})
export class OrderingCoModule {}
