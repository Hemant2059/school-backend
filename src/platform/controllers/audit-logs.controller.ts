import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlatformOnly } from '../../auth/decorators/platform-only.decorator.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

/**
 * The platform audit trail.
 *
 * Every mutating request is recorded by the audit-log interceptor. This
 * controller makes that trail readable, so a privileged action (creating a
 * platform administrator, resetting a password, changing a role) can be
 * traced after the fact.
 */
@PlatformOnly()
@Controller('platform/audit-logs')
export class AuditLogsController {
  constructor(private readonly prisma: PrismaService) {}

  @Permissions('audit.read')
  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = {};

    if (query.userId) where.userId = query.userId;
    if (query.tenantId) where.tenantId = query.tenantId;
    if (query.principalType) where.principalType = query.principalType;
    if (query.method) where.method = query.method;
    if (query.action) where.action = { contains: query.action, mode: 'insensitive' };
    if (query.resourceId) where.resourceId = query.resourceId;
    if (query.statusCode) where.statusCode = Number(query.statusCode);
    if (query.from || query.to) {
      where.createdAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lte: new Date(query.to) } : {}),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: buildMeta(total, page, limit) };
  }

  @Permissions('audit.read')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entry = await this.prisma.auditLog.findUnique({ where: { id } });
    if (!entry) return null;
    return entry;
  }
}
