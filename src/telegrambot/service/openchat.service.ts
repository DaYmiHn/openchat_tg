import axios, { AxiosInstance } from 'axios';
import { OpenChatInterface } from '@telegrambot/util/types';
import { Injectable } from '@nestjs/common';

type MapValue = {
  role: string;
  content: string;
};

type MapKey = string;

@Injectable()
export class OpenChatService implements OpenChatInterface {
  private api: AxiosInstance;
  private usersContext: Map<MapKey, MapValue[]> = new Map();

  constructor() {
    this.api = axios.create({
      baseURL: 'https://openchat.team/api',
      timeout: 20000,
    });
  }

  public async send(text: string, chat_id: string) {
    this.addMessageToUserContext(chat_id, 'user', text);

    const completion = await this.api.post('/chat', {
      model: {
        id: 'openchat_v3.2_mistral',
        name: 'OpenChat Aura',
        maxLength: 24576,
        tokenLimit: 8192,
      },
      messages: this.usersContext.get(chat_id),
      key: '',
      prompt: ' ',
      temperature: 0.5,
    });

    this.addMessageToUserContext(chat_id, 'assistant', completion?.data);

    return completion?.data as string;
  }

  public async addMessageToUserContext(
    chat_id: string,
    role: string,
    content: string,
  ) {
    const exists = this.usersContext.get(chat_id) || [];
    const newMess = {
      role,
      content,
    };
    this.usersContext.set(chat_id, [...exists, newMess]);
  }

  public async resetContextByUserChatId(chat_id: string) {
    this.usersContext.set(chat_id, []);
  }
}
