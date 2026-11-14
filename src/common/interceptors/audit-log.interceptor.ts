import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma.service.js';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Writes an audit row for every mutating request.
 *
 * The `AuditLog` model existed in the schema with full indexes but nothing
 * ever wrote to it, so there was no record of who created a platform admin,
 * reset a password, deleted a permission or marked a fee invoice as paid.
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    if (!MUTATING_METHODS.has(request.method)) return next.handle();

    const principal = request.user as AuthenticatedPrincipal | undefined;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => void this.write(request, response, principal, startedAt),
        error: () => void this.write(request, response, principal, startedAt),
      }),
    );
  }

  private async write(
    request: Request,
    response: Response,
    principal: AuthenticatedPrincipal | undefined,
    startedAt: number,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: principal?.id ?? null,
          principalType: principal?.type ?? 'anonymous',
          tenantId: principal?.tenantId ?? null,
          method: request.method,
          path: request.originalUrl.split('?')[0],
          action: `${request.method} ${request.route?.path ?? request.originalUrl}`,
          resource: request.baseUrl || undefined,
          resourceId: this.readParam(request, 'id'),
          statusCode: response.statusCode,
          ipAddress: request.ip ?? undefined,
          metadata: {
            durationMs: Date.now() - startedAt,
            query: Object.keys(request.query ?? {}).length > 0 ? request.query : undefined,
          },
        },
      });
    } catch (error) {
      // Auditing must never break the request it is auditing.
      this.logger.warn(`Failed to write audit log: ${(error as Error).message}`);
    }
  }

  private readParam(request: Request, name: string): string | null {
    const value = request.params?.[name];
    if (typeof value === 'string') return value;
    return null;
  }
}
