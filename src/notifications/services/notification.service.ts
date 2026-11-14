import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a notification for a recipient.
   *
   * The tenant is derived from the recipient rather than trusted from the
   * body, so a notification cannot be filed against the wrong school.
   */
  async create(dto: any, principal?: AuthenticatedPrincipal) {
    const recipientType = dto.recipientType ?? (principal?.type === 'platform' ? 'PLATFORM_USER' : 'USER');
    const recipientId = dto.recipientId ?? principal?.id;

    if (!recipientId) {
      throw new NotFoundException('A notification needs a recipient');
    }

    let tenantId: string | null = null;
    if (recipientType === 'USER') {
      const membership = await this.prisma.tenantUser.findFirst({
        where: { userId: recipientId, status: 'ACTIVE' },
        select: { tenantId: true },
        orderBy: { isPrimary: 'desc' },
      });
      tenantId = membership?.tenantId ?? null;
    } else {
      tenantId = dto.tenantId ?? null;
    }

    return this.prisma.notification.create({
      data: {
        tenantId,
        recipientType,
        recipientId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        metadata: dto.metadata,
      },
    });
  }

  /**
   * Lists the notifications addressed to the calling principal.
   *
   * The previous implementation filtered by an *optional* client-supplied
   * `tenantId`, so a caller who simply omitted it received every notification
   * in the system — including the SaaS company's own platform notifications.
   * Notifications are now always scoped to the principal's own recipient id.
   */
  async findAll(query: Record<string, any>, principal: AuthenticatedPrincipal) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = {
      recipientType: principal.type === 'platform' ? 'PLATFORM_USER' : 'USER',
      recipientId: principal.id,
      deletedAt: null,
    };
    if (query.type) where.type = query.type;
    if (query.isRead !== undefined) where.isRead = query.isRead;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.notification.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(id: string, principal: AuthenticatedPrincipal) {
    const n = await this.prisma.notification.findFirst({
      where: {
        id,
        recipientType: principal.type === 'platform' ? 'PLATFORM_USER' : 'USER',
        recipientId: principal.id,
        deletedAt: null,
      },
    });
    if (!n) throw new NotFoundException('Notification not found');
    return n;
  }

  async update(id: string, dto: any, principal: AuthenticatedPrincipal) {
    await this.findOne(id, principal);
    const data: Record<string, unknown> = {};
    if (dto.isRead === true) {
      data.isRead = true;
      data.readAt = new Date();
    } else if (dto.isRead === false) {
      data.isRead = false;
      data.readAt = null;
    }
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.message !== undefined) data.message = dto.message;
    if (dto.type !== undefined) data.type = dto.type;

    return this.prisma.notification.update({ where: { id }, data });
  }

  async softDelete(id: string, principal: AuthenticatedPrincipal) {
    await this.findOne(id, principal);
    await this.prisma.notification.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(id: string, principal: AuthenticatedPrincipal) {
    const n = await this.prisma.notification.findFirst({
      where: {
        id,
        recipientType: principal.type === 'platform' ? 'PLATFORM_USER' : 'USER',
        recipientId: principal.id,
      },
    });
    if (!n) throw new NotFoundException('Notification not found');
    if (!n.deletedAt) throw new NotFoundException('Notification is not deleted');
    return this.prisma.notification.update({ where: { id }, data: { deletedAt: null } });
  }

  /** Marks every unread notification for the principal as read. */
  async markAllRead(principal: AuthenticatedPrincipal) {
    const result = await this.prisma.notification.updateMany({
      where: {
        recipientType: principal.type === 'platform' ? 'PLATFORM_USER' : 'USER',
        recipientId: principal.id,
        isRead: false,
        deletedAt: null,
      },
      data: { isRead: true, readAt: new Date() },
    });
    return { updated: result.count };
  }
}
