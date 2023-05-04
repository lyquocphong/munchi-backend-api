import { Expose, Type } from 'class-transformer';

export class OrderingSignInResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  level: number;

  @Expose()
  accessToken: string;

  
  @Expose()
  tokenType: string;

  
  @Expose()
  expireIn: number;

  @Expose()
  refreshToken?: string;
}
