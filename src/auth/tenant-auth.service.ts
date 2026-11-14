import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TenantStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { parseDurationMs } from '../common/utils/duration.js';

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const DUMMY_HASH = '$2b$12$L6.YHOJOb10trz2q5dDhCufH9Hf21dM.Wkgn9Fh..ZvuHKKmtz1WG';

@Injectable()
export class TenantAuthService {
  private readonly logger = new Logger(TenantAuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string, tenantId?: string) {
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });

    // Constant-time comparison even for unknown accounts (see auth.service.ts).
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hash);
    if (!user || !user.passwordHash || !valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('User is not active');

    let membership;
    if (tenantId) {
      membership = await this.prisma.tenantUser.findFirst({
        where: { userId: user.id, tenantId, status: 'ACTIVE' },
        include: { tenant: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
      });
    } else {
      const memberships = await this.prisma.tenantUser.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
        include: { tenant: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
      });
      if (memberships.length === 0) throw new UnauthorizedException('No tenant membership');
      if (memberships.length > 1) throw new BadRequestException('tenantId is required');
      membership = memberships[0];
    }
    if (!membership) throw new UnauthorizedException('No active membership for this tenant');

    // A suspended, deactivated or still-onboarding school must not be able to
    // authenticate. This was previously never checked anywhere.
    if (membership.tenant.status !== TenantStatus.ACTIVE) {
      throw new ForbiddenException(
        `School access is not available while the tenant is ${membership.tenant.status}`,
      );
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return this.issueTokens(user, membership);
  }

  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (!payload.tenantId) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findFirst({ where: { id: payload.sub, deletedAt: null } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    // A refresh must not resurrect a suspended account.
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('User is not active');

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    const membership = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id, tenantId: payload.tenantId, status: 'ACTIVE' },
      include: { tenant: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
    if (!membership) throw new UnauthorizedException('No active membership');
    if (membership.tenant.status !== TenantStatus.ACTIVE) {
      throw new ForbiddenException(
        `School access is not available while the tenant is ${membership.tenant.status}`,
      );
    }

    return this.issueTokens(user, membership);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
    });
    return { loggedOut: true };
  }

  /**
   * Tenant users were previously unable to change their password at all:
   * the only change-password endpoint resolved the id against `PlatformUser`,
   * so a tenant token always got "User not found".
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hash,
        // Invalidate existing sessions.
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });
    return { changed: true };
  }

  async getMe(userId: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
    if (!user) throw new UnauthorizedException('User not found');
    const membership = await this.prisma.tenantUser.findFirst({
      where: { userId, tenantId, status: 'ACTIVE' },
      include: { tenant: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
    if (!membership) throw new UnauthorizedException('No active membership');

    const permissionSet = new Set<string>();
    for (const tur of membership.roles) for (const rp of tur.role.permissions) permissionSet.add(rp.permission.code);

    return {
      id: user.id,
      email: user.email,
      firstNameEn: user.firstNameEn,
      lastNameEn: user.lastNameEn,
      tenantId,
      roles: membership.roles.map((r) => r.role.name),
      permissions: Array.from(permissionSet),
    };
  }

  private async issueTokens(user: any, membership: any) {
    const permissionSet = new Set<string>();
    for (const tur of membership.roles) for (const rp of tur.role.permissions) permissionSet.add(rp.permission.code);
    const permissions = Array.from(permissionSet);
    const roles = membership.roles.map((r: any) => r.role.name);

    const accessSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessExpires = this.configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
    const refreshExpires = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, tenantId: membership.tenantId, roles, permissions },
      { secret: accessSecret, expiresIn: accessExpires as any },
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id, tenantId: membership.tenantId },
      { secret: refreshSecret, expiresIn: refreshExpires as any },
    );

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: refreshHash,
        refreshTokenExpiresAt: new Date(Date.now() + parseDurationMs(refreshExpires)),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstNameEn: user.firstNameEn, lastNameEn: user.lastNameEn, tenantId: membership.tenantId, roles, permissions },
    };
  }
}
