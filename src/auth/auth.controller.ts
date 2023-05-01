import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth';
import { OrderingCoService } from 'src/ordering-co/ordering-co.service';
import { RefreshJwtGuard } from './guards/refreshJwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('signout')
  signOut() {
    return this.authService.signOut();
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refreshToken')
  getRefreshTokens(@Request() req: any) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokenValidate(userId, refreshToken);
  }
}
