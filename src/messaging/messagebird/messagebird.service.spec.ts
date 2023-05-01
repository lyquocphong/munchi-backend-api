import { Test, TestingModule } from '@nestjs/testing';
import { MessageBirdService } from './messagebird.service';

describe('MessageBirdService', () => {
  let service: MessageBirdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageBirdService],
    }).compile();

    service = module.get<MessageBirdService>(MessageBirdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
