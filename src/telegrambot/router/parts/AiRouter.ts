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
    const sentMessage = (await this.messageSender.sendMessage(user.chat_id, {
      chat_id: user.chat_id,
      text: `Думаю...`,
      parse_mode: 'markdown',
    })) as any;

    return sentMessage.data.result.message_id;
  }

  @Waiting('ask_ai')
  public async waitingAskAi(text: string) {
    const { user } = getContext();

    const message_id = await this.sendThinkingMessage();
    const stream = await this.openChatService.getStream(text, user.chat_id);

    let respSafe = '';
    let resp = '';
    let lastUpdate = 0;

    stream.on('data', (chunk) => {
      respSafe += Buffer.from(chunk)
        .toString()
        .replace(/`/gim, '\\`')
        .replace(/\[/gim, '\\`');
      resp += Buffer.from(chunk).toString();
      const currentTime = new Date().getTime();
      if (currentTime - lastUpdate > 500) {
        lastUpdate = currentTime;

        this.messageSender
          .editMessage(message_id, {
            chat_id: user.chat_id,
            text: respSafe,
            parse_mode: 'markdown',
          })
          .catch(() => {});
      }
    });

    setInterval(() => {
      if (lastUpdate === 0) {
        lastUpdate = new Date().getTime();

        this.messageSender
          .editMessage(message_id, {
            chat_id: user.chat_id,
            text: respSafe,
            parse_mode: 'markdown',
          })
          .catch(() => {});
      }
    }, 500);

    stream.on('end', () => {
      this.openChatService.addMessageToUserContext(
        user.chat_id,
        'assistant',
        resp,
      );
      this.messageSender
        .editMessage(message_id, {
          chat_id: user.chat_id,
          text: resp,
          parse_mode: 'markdown',
        })
        .catch(() => {});
    });
  }

  @Message('/reset')
  public async resetContext() {
    const { user } = getContext();
    await this.openChatService.resetContextByUserChatId(user.chat_id);
  }
}
