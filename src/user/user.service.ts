import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './dto/user-response.dto';
import { generateUuid } from 'src/common/utils/generateUuid';
import Cryptr from 'cryptr';
import { ConfigService } from '@nestjs/config';
import { OrderingSignInResponseDto } from 'src/ordering-co/dto/signin-response.dto';

export type AuthTokens = {
  verifyToken: string;
  refreshToken: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  async createUser(data: OrderingSignInResponseDto, password: string) {
    const cryptr = new Cryptr(this.configService.get<string>('app.hash_secret') as string);
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
          publicId: generateUuid(),
          session: {
            create: {
              accessToken: data.accessToken,
              expiresIn: data.expireIn,
              tokenType: data.tokenType,
            },
          },
          refreshToken: '',
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

      return newUser;
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
