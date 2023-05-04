import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { LoginDto } from 'src/auth/dto/auth';
import { OrderingBusinessResponseDto } from './dto/business-response.dto';
import { OrderingSignInResponseDto } from './dto/signin-response.dto';

@Injectable()
export class OrderingCoService {
  constructor(private configService: ConfigService) {}
  public validateWebhookSecret(checkSecret: string): boolean {
    let webhookSecret = this.configService.get<string>('orderingco.webhook.secret') as string;
    return webhookSecret === checkSecret;
  }

  public getWebhookSecret(): string {
    return this.configService.get<string>('orderingco.webhook.secret') as string;
  }

  async signIn(loginDto: LoginDto): Promise<OrderingSignInResponseDto> {
    const options = {
      method: 'POST',
      url: `${this.configService.get<string>('orderingco.url')}auth`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      data: {
        email: loginDto.email,
        password: loginDto.password,
        security_recaptcha_auth: '0',
      },
    };
    try {
      const response = await axios.request(options);
      const signInResponseObject = response.data.result;
      return {
        id: signInResponseObject.id,
        name: signInResponseObject.name,
        lastName: signInResponseObject.lastname,
        level: signInResponseObject.level,
        email: signInResponseObject.email,
        accessToken: signInResponseObject.session.access_token,
        tokenType: signInResponseObject.session.token_type,
        expireIn: signInResponseObject.session.expires_in,
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  async signOut(accessToken: string): Promise<any> {
    const options = {
      method: 'POST',
      url: `${this.configService.get<string>('orderingco.url')}auth/logout`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.request(options);
      return response.data.result;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  async allBusiness(accessToken: string): Promise<any> {
    const options = {
      method: 'GET',
      url: `${this.configService.get<string>('orderingco.url')}business?type=1&params=zones%2Cname&mode=dashboard`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.request(options);
      return response.data.result;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }

  async businessById(accessToken: string, businessId: number) {
    const options = {
      method: 'GET',
      url: `${this.configService.get<string>('orderingco.url')}business/${businessId}?type=1&params=zones%2Cname&mode=dashboard`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.request(options);
      return plainToClass(OrderingBusinessResponseDto, response.data.result);
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error);
    }
  }
}
