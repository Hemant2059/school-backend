import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TenantAuthService } from './tenant-auth.service.js';
import { TenantAuthController } from './tenant-auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    PassportModule,
    // The secret is resolved lazily from the validated configuration. The
    // previous version read `process.env.JWT_SECRET` at import time — which is
    // *before* ConfigModule loads `.env` — and fell back to a publicly known
    // development string.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '15m' } as any,
      }),
    }),
  ],
  controllers: [AuthController, TenantAuthController],
  providers: [AuthService, TenantAuthService, JwtStrategy],
  exports: [AuthService, TenantAuthService],
})
export class AuthModule {}
