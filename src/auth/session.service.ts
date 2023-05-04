import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthTokens } from './dto/auth';
import { Session } from '@prisma/client';
@Injectable()
export class SessionService {
  constructor(private configService: ConfigService, private readonly prismaService: PrismaService) {}

  async getAccessToken(userId: number): Promise<string> {
    const session = await this.prismaService.session.findUnique({
      where: {
        userId: userId,
      },
    });
    return session!.accessToken;
  }

  /**
   * The function will update tokens inside session and create a new one if a session is null
   *
   * @param   {number}            userId  The id of the user
   * @param   {AuthTokens<void>}  tokens  Tokens which used to update session or create new one
   *
   * @return  {Promise<void>}             The function return nothing
   */
  async updateOrCreateSession(userId: number, tokens: AuthTokens): Promise<void> {
    const hashedRefreshToken = await argon2.hash(tokens.refreshToken!);
    const session = await this.prismaService.session.findUnique({
      where: {
        userId: userId,
      },
    });
    const data: any = {
      refreshToken: hashedRefreshToken,
    };

    if (tokens.accessToken && session) {
      data.session = {
        update: {
          accessToken: tokens.accessToken,
        },
      };
    } else {
      data.session = {
        create: {
          accessToken: tokens.accessToken,
        },
      };
    }

    try {
      await this.prismaService.user.update({
        where: {
          userId: userId,
        },
        data,
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  /**
   * The function will hash refresh token using argon2
   *
   * @param   {number}            userId  The id of the user
   * @param   {AuthTokens<void>}  token   Token need to be hash
   *
   * @return  {Promise<void>}             The function return nothing
   */
  async hashRefreshToken(userId: number, token: AuthTokens): Promise<void> {
    const hashedRefreshToken = await argon2.hash(token.refreshToken!);
    await this.prismaService.user.update({ where: { userId: userId }, data: { refreshToken: hashedRefreshToken } });
  }

  async deleteSession(userId: number): Promise<Session> {
    return await this.prismaService.session.delete({
      where: {
        userId: userId,
      },
    });
  }
}
