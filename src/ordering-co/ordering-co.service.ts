import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoginDto } from 'src/auth/dto/auth';
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
        expireIn: signInResponseObject.session.expires_in
      }
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error)
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
      return  response.data.result
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(error)
    }
   
  }
}
