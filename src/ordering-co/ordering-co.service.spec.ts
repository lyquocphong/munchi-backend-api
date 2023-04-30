import { Test, TestingModule } from '@nestjs/testing';
import { OrderingCoService } from './ordering-co.service';

describe('OrderingCoService', () => {
  let service: OrderingCoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderingCoService],
    }).compile();

    service = module.get<OrderingCoService>(OrderingCoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
