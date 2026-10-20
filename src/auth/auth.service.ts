import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PlatformUserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
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

    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== PlatformUserStatus.ACTIVE) throw new UnauthorizedException('User is not active');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      await this.prisma.platformUser.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.platformUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), failedLoginAttempts: 0 },
    });

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
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
    const hash = await bcrypt.hash(newPassword, 10);
    await this.prisma.platformUser.update({
      where: { id: userId },
      data: { passwordHash: hash, passwordChangedAt: new Date() },
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
    for (const r of user.roles) for (const rp of r.role.permissions) permissionSet.add(rp.permission.code);
    for (const up of user.permissions) {
      if (up.granted) permissionSet.add(up.permission.code);
      else permissionSet.delete(up.permission.code);
    }

    return {
      id: user.id,
      email: user.email,
      firstNameEn: user.firstNameEn,
      firstNameNe: user.firstNameNe,
      lastNameEn: user.lastNameEn,
      lastNameNe: user.lastNameNe,
      status: user.status,
      roles,
      permissions: Array.from(permissionSet),
    };
  }

  private async issueTokens(user: any) {
    const roles = user.roles.map((r: any) => r.role.name);
    const permissionSet = new Set<string>();
    for (const r of user.roles) for (const rp of r.role.permissions) permissionSet.add(rp.permission.code);
    for (const up of user.permissions) {
      if (up.granted) permissionSet.add(up.permission.code);
      else permissionSet.delete(up.permission.code);
    }
    const permissions = Array.from(permissionSet);

    const accessSecret = this.configService.get<string>('JWT_SECRET') ?? 'dev-access-secret';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
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
      data: { refreshTokenHash: refreshHash, refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TTL_MS) },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstNameEn: user.firstNameEn, lastNameEn: user.lastNameEn, roles, permissions },
    };
  }
}