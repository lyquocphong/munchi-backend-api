import { OrderingSignInResponseDto } from 'src/ordering-co/dto/signin-response.dto';

export class UserResponse {
  email: string;
  firstName: string;
  lastName: string;
  level: number;
  publicId: string;
  verifyToken: string;
  refreshToken: string;
  constructor(partial: UserResponse) {
    Object.assign(this, partial);
  }
  static createFromUser(
    user: {
      email: string;
      firstName: string;
      lastName: string;
      level: number;
      publicId: string;
    },
    tokens: {
      verifyToken?: string;
      refreshToken?: string;
    },
  ) {
    return new UserResponse({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      level: user.level as number,
      publicId: user.publicId,
      verifyToken: tokens.verifyToken as string,
      refreshToken: tokens.refreshToken as string,
    });
  }
}

export class UserDto {
  firstName: string;
  lastName: string;
  email: string;
  publicId: string;
  level: number;
  refreshToken: string | null;
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}

export class UserData {
  userId: number;
  firstName: string;
  lastName: string;
  level: number;
  accessToken: string;
  tokenType: string;
  expireIn: number;
  constructor(partial: Partial<UserData>) {
    Object.assign(this, partial);
  }
  static createFromOrderingSignInReponse(data: OrderingSignInResponseDto) {
    return new UserData({
      userId: data.id,
      firstName: data.name,
      lastName: data.lastName,
      accessToken: data.accessToken,
      expireIn: data.expireIn,
      level: data.level,
      tokenType: data.tokenType,
    });
  }
}
