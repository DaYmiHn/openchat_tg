import * as asyncHooks from 'async_hooks';
import { v4 } from 'uuid';
import { User } from '@prisma/client';
import { UserService } from '@telegrambot/service/user.service';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

interface AlsContext {
  requestId: string;
  data: {
    user: User;
    callback_id: string | undefined;
    message_id: number;
    new_user: boolean;
  };
}

const store = new Map();

const asyncHook = asyncHooks.createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId));
    }
  },
  destroy: (asyncId) => {
    if (store.has(asyncId)) {
      store.delete(asyncId);
    }
  },
});

asyncHook.enable();

export const createRequestContext = (
  data: AlsContext['data'],
  requestId = v4(),
) => {
  const requestInfo: AlsContext = { requestId, data };
  store.set(asyncHooks.executionAsyncId(), requestInfo);
  return requestInfo;
};

export const getContext = (): AlsContext['data'] => {
  return store.get(asyncHooks.executionAsyncId())?.data;
};

export const getUser = (): User => {
  return getContext().user;
};

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  async use(req: any, res: Response, next: NextFunction) {
    const chat =
      req.body.message?.chat || req.body.callback_query?.message.chat;

    if (!chat) {
      res.send('atata!');
    }
    const [user, new_user] = await this.userService.createUser(chat);
    const message_id =
      req.body.message?.message_id ||
      req.body.callback_query?.message?.message_id;
    const callback_id = req.body.callback_query?.id;
    const requestInfo = createRequestContext({
      user,
      callback_id,
      message_id,
      new_user,
    });

    req.requestInfo = requestInfo;
    next();
  }
}
