import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    return this.prisma.notification.create({ data: dto });
  }

  async findAll(q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = {};
    if (q.tenantId) where.tenantId = q.tenantId;
    if (q.recipientType) where.recipientType = q.recipientType;
    if (q.recipientId) where.recipientId = q.recipientId;
    if (q.isRead !== undefined) where.isRead = q.isRead;
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.notification.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(id: string) {
    const n = await this.prisma.notification.findUnique({ where: { id } });
    if (!n) throw new NotFoundException('Notification not found');
    return n;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.isRead === true) data.readAt = new Date();
    if (dto.isRead === false) data.readAt = null;
    return this.prisma.notification.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    await this.findOne(id);
    await this.prisma.notification.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(id: string) {
    const n = await this.prisma.notification.findUnique({ where: { id } });
    if (!n) throw new NotFoundException('Notification not found');
    if (!n.deletedAt) throw new ConflictException('Notification is not deleted');
    return this.prisma.notification.update({ where: { id }, data: { deletedAt: null } });
  }
}