import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PlatformUserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { parseDurationMs } from '../common/utils/duration.js';

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.platformUser.findFirst({
      where: { email, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
      },
    });

    // Always run a bcrypt comparison so that a missing account and a wrong
    // password take the same time. Without this the login endpoint is a user
    // enumeration oracle.
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);
    if (!user || !user.passwordHash || !valid) {
      if (user) {
        await this.registerFailedAttempt(user.id, user.failedLoginAttempts, user.lockedUntil);
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== PlatformUserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked. Try again later.');
    }

    await this.prisma.platformUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
    });

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.platformUser.findFirst({
      where: { id: payload.sub, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
      },
    });

    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    // A refresh must not resurrect a suspended or deactivated account.
    if (user.status !== PlatformUserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.platformUser.update({
      where: { id: userId },
      data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
    });
    return { loggedOut: true };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.platformUser.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.platformUser.update({
      where: { id: userId },
      data: {
        passwordHash: hash,
        passwordChangedAt: new Date(),
        // Force every existing session to re-authenticate.
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });
    return { changed: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.platformUser.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const roles = user.roles.map((r) => r.role.name);
    const permissionSet = new Set<string>();
    for (const r of user.roles) {
      for (const rp of r.role.permissions) permissionSet.add(rp.permission.code);
    }
    for (const up of user.permissions) {
      if (up.granted) permissionSet.add(up.permission.code);
      else permissionSet.delete(up.permission.code);
    }

    return {
      id: user.id,
      email: user.email,
      firstNameEn: user.firstNameEn,
      lastNameEn: user.lastNameEn,
      status: user.status,
      roles,
      permissions: Array.from(permissionSet),
    };
  }

  private async registerFailedAttempt(
    userId: string,
    currentAttempts: number,
    lockedUntil: Date | null,
  ): Promise<void> {
    const attempts = (currentAttempts ?? 0) + 1;
    const shouldLock = attempts >= MAX_FAILED_LOGIN_ATTEMPTS;
    await this.prisma.platformUser.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : lockedUntil,
      },
    });
    if (shouldLock) {
      this.logger.warn(`Locked platform account ${userId} after ${attempts} failed attempts`);
    }
  }

  private async issueTokens(user: any) {
    const roles = user.roles.map((r: any) => r.role.name);
    const permissionSet = new Set<string>();
    for (const r of user.roles) {
      for (const rp of r.role.permissions) permissionSet.add(rp.permission.code);
    }
    for (const up of user.permissions) {
      if (up.granted) permissionSet.add(up.permission.code);
      else permissionSet.delete(up.permission.code);
    }
    const permissions = Array.from(permissionSet);

    const accessSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessExpires = this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
    const refreshExpires = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, roles, permissions },
      { secret: accessSecret, expiresIn: accessExpires as any },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: refreshSecret, expiresIn: refreshExpires as any },
    );

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.platformUser.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: refreshHash,
        refreshTokenExpiresAt: new Date(Date.now() + parseDurationMs(refreshExpires)),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstNameEn: user.firstNameEn, lastNameEn: user.lastNameEn, roles, permissions },
    };
  }
}

/**
 * A bcrypt hash of a value nobody can supply. Comparing against it keeps the
 * timing of a login attempt for a non-existent account indistinguishable
 * from one for a real account with a wrong password.
 */
const DUMMY_HASH = '$2b$12$L6.YHOJOb10trz2q5dDhCufH9Hf21dM.Wkgn9Fh..ZvuHKKmtz1WG';

