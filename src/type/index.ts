import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthCredentials {
  firstName?: string;

  lastname?: string;

  role?: string | number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
