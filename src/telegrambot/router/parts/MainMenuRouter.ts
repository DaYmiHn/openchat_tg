import { getContext } from '@telegrambot/util/ALS';
import { MessageSenderService } from '@telegrambot/messages/messageSender.service';
import { WaitingMessageService } from '@telegrambot/messages/waitingMessage.service';
import { Callback, Waiting, Message } from '@telegrambot/router/Decorators';

export class MainMenuRouter {
  constructor(
    public messageSender: MessageSenderService,
    public waitingMessage: WaitingMessageService,
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
}
