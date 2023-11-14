import { getContext } from '@telegrambot/util/ALS';
import { MessageSenderService } from '@telegrambot/messages/messageSender.service';
import { WaitingMessageService } from '@telegrambot/messages/waitingMessage.service';
import { Callback, Waiting, Message } from '@telegrambot/router/Decorators';
import { PrismaService } from '@telegrambot/util/prisma.service';

export class MainMenuRouter {
  constructor(
    public messageSender: MessageSenderService,
    public waitingMessage: WaitingMessageService,
    public prisma: PrismaService,
  ) {}

  @Message('/start')
  @Callback('[show_menu]')
  public async showMenu() {
    const { user, message_id, callback_id } = getContext();

    const menuPayload = {
      text: `Выберите один из пунктов главного меню`,
      chat_id: user.chat_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🤖 Спросить ИИ', callback_data: `[ask_ai]=XXX` }],
        ],
      },
    };

    if (callback_id) {
      await this.messageSender.editMessage(message_id, menuPayload);
    } else {
      await this.messageSender.sendMessage(user.chat_id, menuPayload);
    }
  }

  @Message('/clear')
  public async clear() {
    console.log('--------- CLEARED ---------');
    await this.prisma.review.deleteMany({});
    await this.prisma.usersOnShops.deleteMany({});
    await this.prisma.shop.deleteMany({});
    await this.prisma.user.deleteMany({});
  }
}
