import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TenantAuthService } from './tenant-auth.service.js';
import { TenantLoginDto } from './dto/tenant-login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedPrincipal } from './types/principal.js';

@Controller('tenant/auth')
export class TenantAuthController {
  constructor(private readonly authService: TenantAuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  login(@Body() dto: TenantLoginDto) {
    return this.authService.login(dto.email, dto.password, dto.tenantId);
  }

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @HttpCode(200)
  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser('id') userId: string) {
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedPrincipal) {
    return this.authService.getMe(user.id, user.tenantId!);
  }
}
