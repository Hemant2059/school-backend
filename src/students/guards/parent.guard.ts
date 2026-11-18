import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';
import { PrismaService } from '../../prisma.service.js';

/**
 * Ensures the calling tenant principal is linked to a guardian record and
 * whose linked children are the only students accessible through this route.
 *
 * The `Guardian.userId` column links a guardian record to a `User` that
 * can authenticate. When a parent is not yet linked, the request is refused
 * — there is no fallback path that would expose every student in the
 * school.
 *
 * The guard attaches `request.parentGuardianId` to the request so services
 * can scope queries to the parent's own children.
 */
@Injectable()
export class ParentGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedPrincipal | undefined;

    if (!user || user.type !== 'tenant') {
      throw new ForbiddenException('Only school accounts can use the parent portal');
    }

    const guardian = await this.prisma.guardian.findFirst({
      where: { tenantId: user.tenantId!, userId: user.id, deletedAt: null },
      select: { id: true },
    });

    if (!guardian) {
      throw new ForbiddenException(
        'This account is not linked to a parent record. Ask the school administrator to link your account to your child’s guardian record.',
      );
    }

    request.parentGuardianId = guardian.id;
    return true;
  }
}
