import { Controller, Req, Res, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import { IndexRouter } from '@telegrambot/router/IndexRouter';

@Controller()
export class TelegramBotController {
  constructor(private readonly tgBotRouter: IndexRouter) {}

  @Post('/')
  async main(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const data = req.body;
    if ('message' in data) {
      await this.tgBotRouter.handleMessage(data.message);
    } else if ('callback_query' in data) {
      await this.tgBotRouter.handleCallbackQuery(data.callback_query);
    }
    return res.sendStatus(200);
  }
}
