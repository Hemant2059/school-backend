import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PlatformUserStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'dev-access-secret',
    });
  }

  async validate(payload: any) {
    if (payload.tenantId) {
      const user = await this.prisma.user.findFirst({
        where: { id: payload.sub, deletedAt: null },
        include: {
          tenantUsers: {
            where: { tenantId: payload.tenantId },
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
          },
        },
      });
      const membership = user?.tenantUsers?.[0];
      if (!user || !membership || membership.status !== 'ACTIVE') {
        throw new UnauthorizedException('Invalid tenant token');
      }

      const permissionSet = new Set<string>();
      for (const tur of membership.roles) {
        for (const rp of tur.role.permissions) permissionSet.add(rp.permission.code);
      }

      return {
        type: 'tenant',
        id: user.id,
        email: user.email,
        tenantId: payload.tenantId,
        tenantUserId: membership.id,
        roles: membership.roles.map((r) => r.role.name),
        permissions: Array.from(permissionSet),
      };
    }

    const user = await this.prisma.platformUser.findFirst({
      where: { id: payload.sub, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
      },
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (user.status !== PlatformUserStatus.ACTIVE) throw new UnauthorizedException('User is not active');

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
      type: 'platform',
      id: user.id,
      email: user.email,
      firstNameEn: user.firstNameEn,
      lastNameEn: user.lastNameEn,
      roles,
      permissions: Array.from(permissionSet),
    };
  }
}