import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StopService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const route = await this.prisma.transportRoute.findFirst({ where: { id: dto.routeId, tenantId } });
    if (!route) throw new NotFoundException('Route not found');
    return this.prisma.transportStop.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.transportStop.findMany({ where: { tenantId, deletedAt: null }, include: { route: true }, orderBy: { sequence: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const stop = await this.prisma.transportStop.findFirst({ where: { id, tenantId, deletedAt: null }, include: { route: true } });
    if (!stop) throw new NotFoundException('Stop not found');
    return stop;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.routeId) {
      const route = await this.prisma.transportRoute.findFirst({ where: { id: dto.routeId, tenantId } });
      if (!route) throw new NotFoundException('Route not found');
    }
    return this.prisma.transportStop.update({ where: { id }, data: dto, include: { route: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.transportStop.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const stop = await this.prisma.transportStop.findUnique({ where: { id } });
    if (!stop || stop.tenantId !== tenantId) throw new NotFoundException('Stop not found');
    if (!stop.deletedAt) throw new ConflictException('Stop is not deleted');
    return this.prisma.transportStop.update({ where: { id }, data: { deletedAt: null } });
  }
}