import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {}

  async createUser(data: any): Promise<[any, boolean]> {
    const user = {
      ...data,
      chat_id: String(data.id),
    };
    return [user, false];
  }
}
