import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PlatformUserStatus, TenantStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import type { AuthenticatedPrincipal } from '../types/principal.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<AuthenticatedPrincipal> {
    if (payload.tenantId) {
      const user = await this.prisma.user.findFirst({
        where: { id: payload.sub, deletedAt: null },
        include: {
          tenantUsers: {
            where: { tenantId: payload.tenantId },
            include: {
              tenant: true,
              roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            },
          },
        },
      });
      const membership = user?.tenantUsers?.[0];
      if (!user || !membership || membership.status !== 'ACTIVE') {
        throw new UnauthorizedException('Invalid tenant token');
      }
      // A suspended or deactivated account must lose access immediately, even
      // if it still holds a valid (unexpired) access token.
      if (user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User is not active');
      }
      // Likewise for the school itself: suspending a tenant must lock out its
      // staff.
      if (membership.tenant.status !== TenantStatus.ACTIVE) {
        throw new UnauthorizedException('School access is not available');
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
        subscriptionStatus: await this.subscriptionStatus(payload.tenantId),
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
      mustChangePassword: user.mustChangePassword,
    };
  }

  /**
   * The tenant's current subscription status. A school whose subscription has
   * been cancelled, suspended or expired must lose access.
   */
  private async subscriptionStatus(tenantId: string): Promise<string> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { status: true, endDate: true },
    });
    if (!subscription) return 'NONE';
    if (subscription.status !== 'EXPIRED' && subscription.endDate < new Date()) {
      return 'EXPIRED';
    }
    return subscription.status;
  }
}
