import { Module } from '@nestjs/common';
import { MessageSenderService } from '@telegrambot/messages/messageSender.service';
import { IndexRouter } from '@telegrambot/router/IndexRouter';
import { WaitingMessageService } from '@telegrambot/messages/waitingMessage.service';
import { UserService } from '@telegrambot/service/user.service';
import { OpenChatService } from '@telegrambot/service/openchat.service';
import { TelegramBotController } from '@telegrambot/telegrambot.controller';
import { GetUserMiddleware } from '@telegrambot/util/ALS';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';

@Module({
  controllers: [TelegramBotController],
  providers: [
    MessageSenderService,
    WaitingMessageService,
    IndexRouter,
    UserService,
    OpenChatService,
  ],
})
export class TelegramBotModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserMiddleware).forRoutes('/');
  }
}
