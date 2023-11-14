import { Injectable } from '@nestjs/common';
import { getContext } from '@telegrambot/util/ALS';
import axios from 'axios';

@Injectable()
export class MessageSenderService {
  constructor() {}

  public async sendMessage(message_id: any, data: any) {
    return await this.query('sendMessage', data);
  }

  public async editMessage(message_id: any, data: any) {
    data.message_id = message_id;
    await this.query('editMessageText', data);
  }

  public async notice(cbq_id: any, text: any = null) {
    const data: any = { callback_query_id: cbq_id, alert: false };
    if (text !== null) {
      data.text = text;
    }
    await this.query('answerCallbackQuery', data);
  }

  public async deleteMessage(chat_id: string, message_id: number) {
    const data: any = { chat_id, message_id };
    await this.query('deleteMessage', data);
  }

  private async query(method: string, fields: any) {
    const { callback_id } = getContext();
    if (callback_id) {
      await axios
        .post(
          `https://api.telegram.org/bot${process.env.TOKEN}/answerCallbackQuery`,
          { callback_query_id: callback_id, alert: false },
        )
        .catch((err: any) =>
          console.log(
            'ERROR_query',
            {
              url: err.config.url,
              data: err.config.data,
            },
            err.response.data,
          ),
        );
    }
    return await axios
      .post(
        `https://api.telegram.org/bot${process.env.TOKEN}/${method}`,
        fields,
      )
      .catch((err: any) =>
        console.log(
          'ERROR_query',
          {
            url: err.config.url,
            data: err.config.data,
          },
          err.response.data,
        ),
      );
  }
}
