import { Module } from '@nestjs/common';
import { TelegramBotModule } from '@telegrambot/telegrambot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
