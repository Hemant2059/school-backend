import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { TenantAuthService } from './tenant-auth.service.js';
import { TenantLoginDto } from './dto/tenant-login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { Public } from './decorators/public.decorator.js';

@Controller('tenant/auth')
export class TenantAuthController {
  constructor(private readonly authService: TenantAuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: TenantLoginDto) {
    return this.authService.login(dto.email, dto.password, dto.tenantId);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  @Get('me')
  me(@Req() req: any) {
    return this.authService.getMe(req.user.id, req.user.tenantId);
  }
}