import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { MessageBirdService } from './messagebird/messagebird.service';

@Module({
  providers: [TelegramService, MessageBirdService],
  exports: [TelegramService, MessageBirdService]
})
export class MessagingModule {}
