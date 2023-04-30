import { Test, TestingModule } from '@nestjs/testing';
import { OrderingCoController } from './ordering-co.controller';

describe('OrderingCoController', () => {
  let controller: OrderingCoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderingCoController],
    }).compile();

    controller = module.get<OrderingCoController>(OrderingCoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
