import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service.js';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class TenantAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string, tenantId?: string) {
    const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('User is not active');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

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

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return this.issueTokens(user, membership);
  }

  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (!payload.tenantId) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findFirst({ where: { id: payload.sub, deletedAt: null } });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid refresh token');
    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) throw new UnauthorizedException('Refresh token expired');
    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    const membership = await this.prisma.tenantUser.findFirst({
      where: { userId: user.id, tenantId: payload.tenantId, status: 'ACTIVE' },
      include: { tenant: true, roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
    });
    if (!membership) throw new UnauthorizedException('No active membership');

    return this.issueTokens(user, membership);
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null, refreshTokenExpiresAt: null } });
    return { loggedOut: true };
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

    const accessSecret = this.configService.get<string>('JWT_SECRET') ?? 'dev-access-secret';
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
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
      data: { refreshTokenHash: refreshHash, refreshTokenExpiresAt: new Date(Date.now() + REFRESH_TTL_MS) },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, firstNameEn: user.firstNameEn, lastNameEn: user.lastNameEn, tenantId: membership.tenantId, roles, permissions },
    };
  }
}