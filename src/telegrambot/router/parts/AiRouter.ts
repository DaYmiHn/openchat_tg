import { getContext } from '@telegrambot/util/ALS';
import { OpenChatService } from '@telegrambot/service/openchat.service';
import { MessageSenderService } from '@telegrambot/messages/messageSender.service';
import { WaitingMessageService } from '@telegrambot/messages/waitingMessage.service';
import { Callback, Message, Waiting } from '@telegrambot/router/Decorators';

export class AiRouter {
  constructor(
    public messageSender: MessageSenderService,
    public waitingMessage: WaitingMessageService,
    public openChatService: OpenChatService,
  ) {}

  @Callback('[ask_ai]')
  public async askAi() {
    const { user } = getContext();
    const sentMessage: any = await this.messageSender.sendMessage(
      user.chat_id,
      {
        chat_id: user.chat_id,
        text: 'Отправьте запрос',
      },
    );

    if (sentMessage?.data === undefined) {
      return;
    }

    this.waitingMessage.set(user.chat_id, {
      type: 'waiting_ask_ai',
      value: sentMessage.data.result.message_id,
    });
  }

  public async sendThinkingMessage() {
    const { user } = getContext();
    let counter = 1;
    const sentMessage = (await this.messageSender.sendMessage(user.chat_id, {
      chat_id: user.chat_id,
      text: `Думаю...`,
      parse_mode: 'markdown',
    })) as any;

    const interval = setInterval(async () => {
      const dots = Array.from(Array(counter).keys())
        .map(() => '.')
        .join('');

      this.messageSender.editMessage(sentMessage.data.result.message_id, {
        chat_id: user.chat_id,
        text: `Думаю${dots}`,
        parse_mode: 'markdown',
      });
      counter++;
      if (counter > 3) {
        counter = 1;
      }
    }, 1000);

    return [interval, sentMessage.data.result.message_id];
  }

  @Waiting('ask_ai')
  public async waitingAskAi(text: string) {
    const { user } = getContext();

    const [interval, message_id] = await this.sendThinkingMessage();

    const answer = await this.openChatService.send(text, user.chat_id);

    clearInterval(interval);

    await this.messageSender.editMessage(message_id, {
      chat_id: user.chat_id,
      text: answer,
      parse_mode: 'markdown',
    });
  }

  @Message('/reset')
  public async resetContext() {
    const { user } = getContext();
    await this.openChatService.resetContextByUserChatId(user.chat_id);
  }
}
