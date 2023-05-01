import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService]
})
export class MessagingModule {}
