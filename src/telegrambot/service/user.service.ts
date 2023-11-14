import { Injectable } from '@nestjs/common';
import { PrismaService } from '@telegrambot/util/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<[User, boolean]> {
    const existsUser = await this.prisma.user.findFirst({
      where: {
        chat_id: String(data.id),
      },
    });

    if (existsUser) {
      const updatedUser = await this.prisma.user.update({
        where: {
          chat_id: String(data.id),
        },
        data: {
          username: data.username,
          first_name: data.first_name,
          last_name: data?.last_name,
        },
      });
      return [updatedUser, false];
    } else {
      const createdUser = await this.prisma.user.create({
        data: {
          first_name: data.first_name,
          last_name: data?.last_name,
          chat_id: String(data.id),
          username: data.username,
        },
      });
      return [createdUser, true];
    }
  }

  // async setNotificationsOnOff(enable: string): Promise<User> {
  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       chat_id: String(data.id),
  //     },
  //   });
  // }
}
