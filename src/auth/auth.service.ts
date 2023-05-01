import { ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { LoginDto } from './dto/auth';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserResponse } from 'src/user/dto/user.dto';
import { Session } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly orderingCoService: OrderingCoService,
    private configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  async signIn(loginDto: LoginDto): Promise<UserResponse> {
    const response = await this.orderingCoService.signIn(loginDto);
    const tokens = await this.getTokens(response.id, response.email);
    const user = await this.user.getUserById(response.id);

    if (!user) {
      const newUser = (await this.user.createUser(response, tokens, loginDto.password)) as UserResponse;
      return newUser;
    }

    await this.updateRefreshToken(response.id, tokens.refreshToken, response.accessToken);
    return UserResponse.createFromUser(user, tokens);
  }

  signOut() {
    throw new NotImplementedException();
  }

  async getTokens(userId: number, email: string): Promise<{ verifyToken: string; refreshToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get('app_secret');
    const refreshSecret = this.configService.get('app_refresh_secret');
    const verifyToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '14d',
      secret: refreshSecret,
    });
    return {
      verifyToken: verifyToken,
      refreshToken: refreshToken,
    };
  }

/**
 * [updateRefreshToken description]
 *
 * @param   {number}         userId        [userId description]
 * @param   {string}         refreshToken  [refreshToken description]
 * @param   {string<void>}   accessToken   [accessToken description]
 *
 * @return  {Promise<void>}                [return description]
 */
  async updateRefreshToken(userId: number, refreshToken: string, accessToken: string | null): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    const data:any =  {
      refreshToken: hashedRefreshToken,
    }
    if (accessToken) {
      data.session = {    
          update: {
            accessToken: accessToken,
          }
      }
    }
    try {
      await this.prisma.user.update({
        where: {
          userId: userId,
        },
        data 
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }
  
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.user.getUserById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.getTokens(user.userId, user.email);
    await this.updateRefreshToken(user.userId, token.refreshToken, null);
    return token;
  }
}
