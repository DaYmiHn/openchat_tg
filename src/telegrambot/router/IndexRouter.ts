import { MessageSenderService } from '@telegrambot/messages/messageSender.service';
import { WaitingMessageService } from '@telegrambot/messages/waitingMessage.service';
import { UserService } from '@telegrambot/service/user.service';
import { OpenChatService } from '@telegrambot/service/openchat.service';

import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@telegrambot/util/prisma.service';

import { MixinRouter } from '@telegrambot/router/MixinRouter';
import { getMetadataFromMixin } from '@telegrambot/router/Decorators';

@Injectable()
export class IndexRouter extends MixinRouter {
  constructor(
    public messageSender: MessageSenderService,
    public waitingMessage: WaitingMessageService,
    public userService: UserService,
    public prisma: PrismaService,
    public openChatService: OpenChatService,
  ) {
    super();
  }

  public async handleMessage(msg: any) {
    const chat_id = String(msg.chat.id);
    const text = msg.text;

    const decorators = getMetadataFromMixin('message', this.routers);
    const decorator = decorators?.filter((e) => {
      if (e?.name === undefined) {
        return false;
      }
      return text.match(new RegExp(e?.name, 'gm'));
    })?.[0];

    if (decorator) {
      await decorator.descriptor.value.call(this);
      return;
    }

    if (this.waitingMessage.has(chat_id)) {
      const { type, value } = this.waitingMessage.get(chat_id);

      const decorators = getMetadataFromMixin('waiting', this.routers);
      const decorator = decorators.filter((e) => {
        if (!e?.name) {
          return false;
        }
        return type.replace('waiting_', '') === e?.name;
      })[0];
      await decorator.descriptor.value.call(this, text, value);
      return true;
    }

    this.waitingAskAi(chat_id, {
      text: `Не понимаю, что мне делать =(`,
      chat_id: chat_id,
      parse_mode: 'html',
    });
  }

  public async handleCallbackQuery(callback_query: any) {
    const c_data = callback_query.data;
    const cbq_id = callback_query.id;
    const [type, value]: string[] = c_data.split('=');

    try {
      console.log(type, value.split(','));
      const decorators = getMetadataFromMixin('callback', this.routers);
      const decorator = decorators.filter((e) => type === e.name)[0];
      await decorator.descriptor.value.call(this, ...value.split(','));
      await this.messageSender.notice(cbq_id, '');
    } catch (error) {
      console.error(error);
      await this.messageSender.notice(cbq_id, '');
    }
  }
}

// `https://telegram.mihailgok.ru/`
