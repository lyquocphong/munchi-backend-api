import { ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { AuthTokens, LoginDto } from './dto/auth';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { Session } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly orderingCoService: OrderingCoService,
    private configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly prismaService: PrismaService,
    private readonly user: UserService,
  ) {}

  /**
   * Sign In service
   *
   * @param   {LoginDto<UserResponse>}  loginDto  It will require an email and a password for user to sign in
   *
   * @return  {Promise<UserResponse>}             UserResponse
   */

  async signIn(loginDto: LoginDto): Promise<UserResponse> {
    try {
      const response = await this.orderingCoService.signIn(loginDto);
      const tokens = await this.generateTokens(response.id, response.email);
      const user = await this.user.findUser({ userId: response.id });
      if (!user) {
        const newUser = await this.user.createUser(response, loginDto.password);
        await this.updateRefreshToken(response.id, tokens);
        return UserResponse.createFromUser(newUser!, tokens);
      }
      await this.updateTokens(response.id, tokens.refreshToken, response.accessToken);
      return UserResponse.createFromUser(user, tokens);
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  /**
   * The function will update the user public id upon called
   *
   * @param   {string}           userPublicId  The public id of user
   *
   * @return  {Promise<string>}                It return a string notify that the user has successfully logout
   */

  async signOut(accessToken: string, userId: number): Promise<string> {
    await this.orderingCoService.signOut(accessToken);
    await this.deleteSession(userId);
    return 'Sign out successfully';
  }

  /**
   * The function will generate verify token and refresh token base on the secret and user information
   *
   * @param   {number}               userId  The id of the user
   * @param   {string}               email   The email of the user
   *
   * @return  {Promise<AuthTokens>}          return verify token and refresh token
   */

  async generateTokens(userId: number, email: string): Promise<AuthTokens> {
    const payload = {
      sub: userId,
      email,
    };

    const verifyToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get('app.jwt.secret'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '14d',
      secret: this.configService.get('app.jwt.refresh_secret'),
    });

    return {
      verifyToken: verifyToken,
      refreshToken: refreshToken,
    };
  }

  /**
   * update tokens like access,refresh and verify token upon login and return it to client.
   * It will create a new access token when the session is null
   *
   * @param   {number}         userId        The id of user
   * @param   {string}         refreshToken  The token use to update verify token when it expire
   * @param   {string | undefined}   accessToken   The token use to talk with ordering-co
   *
   * @return  {Promise<void>}                update access token in database and return new refresh and verify tokens to client
   */

  async updateTokens(userId: number, refreshToken: string, accessToken?: string): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    const session = await this.prismaService.session.findUnique({
      where: {
        userId: userId,
      },
    });
    const data: any = {
      refreshToken: hashedRefreshToken,
    };

    if (accessToken && session) {
      data.session = {
        update: {
          accessToken: accessToken,
        },
      };
    } else {
      data.session = {
        create: {
          accessToken: accessToken,
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
      throw new ForbiddenException();
    }
  }

  /**
   * The function will validate the refresh token from the client and return a new refresh token when the verify token expire
   *
   * @param   {number}    userId        The id of the user
   * @param   {string}    refreshToken  The refresh token sent from client
   *
   * @return  {<userId>}                It will return a new token set
   */

  async refreshToken(userId: number, refreshToken: string): Promise<AuthTokens> {
    const user = await this.user.findUser({ userId: userId });
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.generateTokens(user.userId, user.email);
    await this.updateTokens(user.userId, token.refreshToken);
    return token;
  }

  /**
   * The function will update refresh token on create a new user as the default token was an empty string
   *
   * @param   {number}            userId  The id of the user
   * @param   {AuthTokens}        token   The token passing from the parent function
   *
   * @return  {Promise<void>}
   */

  async updateRefreshToken(userId: number, token: AuthTokens): Promise<void> {
    const hashedRefreshToken = await argon2.hash(token.refreshToken);
    await this.prismaService.user.update({ where: { userId: userId }, data: { refreshToken: hashedRefreshToken } });
  }

  async getAccessToken(userId: number): Promise<string> {
    const session = await this.prismaService.session.findUnique({
      where: {
        userId: userId,
      },
    });
    return session!.accessToken;
  }

  async deleteSession(userId: number): Promise<Session> {
    return await this.prismaService.session.delete({
      where: {
        userId: userId,
      },
    });
  }
}
