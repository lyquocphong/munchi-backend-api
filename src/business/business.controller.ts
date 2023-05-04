import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessService, private readonly authService: AuthService) {}

  @Post('all-business')
  async allBusiness(@Body('userPublicId') userPublicId: string, @Request() request: any) {
    const { userId } = request.user;
    const accessToken = await this.authService.getAccessToken(userId);
    return this.businessService.allBusiness(accessToken, userPublicId);
  }

  @Get(':businessId')
  async getBusinessById(@Request() req: any, @Param('businessId') businessPublicId: string) {
    const { userId } = req.user;
    const accessToken = await this.authService.getAccessToken(userId);
    return this.businessService.findById(accessToken,businessPublicId);
  }
}
