import axios, { AxiosInstance } from 'axios';
import { OpenChatInterface } from '@telegrambot/util/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenChatService implements OpenChatInterface {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://openchat.team/api',
      timeout: 20000,
    });
  }

  public async send(text: string) {
    const completion = await this.api.post('/chat', {
      model: {
        id: 'openchat_v3.2_mistral',
        name: 'OpenChat Aura',
        maxLength: 24576,
        tokenLimit: 8192,
      },
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      key: '',
      prompt: ' ',
      temperature: 0.5,
    });

    return completion?.data;
  }
}
