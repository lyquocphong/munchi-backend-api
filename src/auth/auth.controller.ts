import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @UseGuards(JwtGuard)
  @Post('signout')
  async signOut(@Request() request: any) {
    const { userId } = request.user;

    return this.authService.signOut(userId);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refreshToken')
  refreshToken(@Request() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];

    return this.authService.refreshToken(userId, refreshToken);
  }
}
