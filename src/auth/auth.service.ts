import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from 'src/user/dto/user-response.dto';
import { UserService } from 'src/user/user.service';
import { AuthTokens, LoginDto } from './dto/auth';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly orderingCoService: OrderingCoService,
    private configService: ConfigService,
    private readonly jwt: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
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
      const user = await this.userService.findUserById(response.id);

      if (!user) {
        const user = await this.userService.createUser(
          Object.assign({ ...response }, tokens.refreshToken),
          loginDto.password,
        );
        await this.sessionService.hashRefreshToken(response.id, tokens);

        return UserResponse.createFromUser(user!, tokens);
      }
      await this.sessionService.updateOrCreateSession(response.id, {
        refreshToken: tokens.refreshToken,
        accessToken: response.accessToken,
      });

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

  async signOut(userId: number): Promise<void> {
    const accessToken = await this.sessionService.getAccessToken(userId);
    await this.orderingCoService.signOut(accessToken);
    await this.sessionService.deleteSession(userId);
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
   * The function will validate the refresh token from the client and return a new refresh token when the verify token expire
   *
   * @param   {number}    userId        The id of the user
   * @param   {string}    refreshToken  The refresh token sent from client
   *
   * @return  {<userId>}                It will return a new token set
   */

  async refreshToken(userId: number, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userService.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const token = await this.generateTokens(user.userId, user.email);

    await this.sessionService.updateOrCreateSession(user.userId, { refreshToken: refreshToken });

    return token;
  }
}
