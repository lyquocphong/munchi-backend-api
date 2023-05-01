import { ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { LoginDto } from './dto/auth';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthTokens, UserService } from 'src/user/user.service';
import { UserResponse } from 'src/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly orderingCoService: OrderingCoService,
    private configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly user: UserService,
  ) {}

  /**
   * Sign In service
   *
   * @param   {LoginDto<UserResponse>}  loginDto  It will include an email and a password for user to sign in
   *
   * @return  {Promise<UserResponse>}             UserResponse
   */

  async signIn(loginDto: LoginDto): Promise<UserResponse> {
    const response = await this.orderingCoService.signIn(loginDto);
    const tokens = await this.getTokens(response.id, response.email);
    const user = await this.user.getUserById(response.id);

    if (!user) {
      return (await this.user.createUser(response, tokens, loginDto.password)) as UserResponse;
    }

    await this.updateTokens(response.id, tokens.refreshToken, response.accessToken);
    return UserResponse.createFromUser(user, tokens);
  }

  signOut() {
    throw new NotImplementedException();
  }

  /**
   * The function will generate verify token and refresh token base on the secret and user information
   *
   * @param   {number}               userId  The id of the user
   * @param   {string<AuthTokens>}   email   The email of the user
   *
   * @return  {Promise<AuthTokens>}          return verify token and refresh token
   */

  async getTokens(userId: number, email: string): Promise<AuthTokens> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.configService.get('app.jwt_secret');
    const refreshSecret = this.configService.get('app.jwt_refresh_secret');

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
   * update tokens like access,refresh and verify token upon login and return it to client
   *
   * @param   {number}         userId        The id of user
   * @param   {string}         refreshToken  The token use to update verify token when it expire
   * @param   {string<void>}   accessToken   The token use to talk with ordering-co
   *
   * @return  {Promise<void>}                update access token in database and return new refresh and verify tokens to client
   */

  async updateTokens(userId: number, refreshToken: string, accessToken?: string): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    const data: any = {
      refreshToken: hashedRefreshToken,
    };

    if (accessToken) {
      data.session = {
        update: {
          accessToken: accessToken,
        },
      };
    }

    try {
      await this.prisma.user.update({
        where: {
          userId: userId,
        },
        data,
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  /**
   * The function will validate the refresh token from the client and return a new refresh token when the verify token expire
   *
   * @param   {number}    userId        [userId description]
   * @param   {string}    refreshToken  [refreshToken description]
   *
   * @return  {<userId>}                [return description]
   */

  async refreshTokenValidate(userId: number, refreshToken: string): Promise<AuthTokens> {
    const user = await this.user.getUserById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const token = await this.getTokens(user.userId, user.email);
    await this.updateTokens(user.userId, token.refreshToken);
    return token;
  }
}
