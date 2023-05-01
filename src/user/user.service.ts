import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './dto/user.dto';
import { getPublicId } from 'src/common/utils/getPublicId';
import Cryptr from 'cryptr';
import { ConfigService } from '@nestjs/config';
import { OrderingSignInResponseDto } from 'src/ordering-co/dto/ordering-co.dto';
export type AuthTokens = {
  verifyToken: string;
  refreshToken: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}
  async createUser(data: OrderingSignInResponseDto, tokens: AuthTokens, password: string) {
    const cryptr = new Cryptr(this.configService.get<string>('app_secret') as string);
    const hashPassword = cryptr.encrypt(password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          userId: data.id,
          firstName: data.name,
          lastName: data.lastName,
          email: data.email,
          hash: hashPassword,
          level: data.level,
          publicId: getPublicId(),
          session: {
            create: {
              accessToken: data.accessToken,
              expiresIn: data.expireIn,
              tokenType: data.tokenType,
            },
          },
          refreshToken: tokens.refreshToken,
        },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          publicId: true,
          level: true,
          refreshToken: true,
        },
      });
      return UserResponse.createFromUser(newUser, tokens);
    } catch (error) {
      console.log(error);
    }
  }
  async getUserById(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        publicId: true,
        level: true,
        userId: true,
        session: {
          select: {
            accessToken: true,
            expiresIn: true,
            tokenType: true,
          },
        },
        business: {
          select: {
            publicId: true,
            name: true,
          },
        },
        refreshToken: true,
      },
    });
  }
}
