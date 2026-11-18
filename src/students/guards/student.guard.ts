import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';
import { PrismaService } from '../../prisma.service.js';

/**
 * Ensures the calling tenant principal is linked to a student record and
 * attaches the student id to the request.
 *
 * The `Student.userId` column links a student record to a `User` that can
 * authenticate. Without a linked account the request is refused — there is
 * no fallback that would expose another student's data.
 */
@Injectable()
export class StudentGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedPrincipal | undefined;

    if (!user || user.type !== 'tenant') {
      throw new ForbiddenException(
        'Only school accounts can use the student portal',
      );
    }

    const student = await this.prisma.student.findFirst({
      where: { tenantId: user.tenantId!, userId: user.id, deletedAt: null },
      select: { id: true },
    });

    if (!student) {
      throw new ForbiddenException(
        'This account is not linked to a student record. Ask the school to link your account to your student record.',
      );
    }

    request.studentId = student.id;
    return true;
  }
}
