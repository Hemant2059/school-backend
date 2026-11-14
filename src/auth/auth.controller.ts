import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { Public } from './decorators/public.decorator.js';
import { PlatformOnly } from './decorators/platform-only.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedPrincipal } from './types/principal.js';

@PlatformOnly()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @HttpCode(200)
  @Post('logout')
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
    return this.authService.getMe(user.id);
  }
}
