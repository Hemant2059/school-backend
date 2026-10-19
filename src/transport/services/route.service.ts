import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class RouteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.vehicleId) {
      const v = await this.prisma.transportVehicle.findFirst({ where: { id: dto.vehicleId, tenantId } });
      if (!v) throw new NotFoundException('Vehicle not found');
    }
    return this.prisma.transportRoute.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.transportRoute.findMany({ where: { tenantId, deletedAt: null }, include: { vehicle: true, stops: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const r = await this.prisma.transportRoute.findFirst({ where: { id, tenantId, deletedAt: null }, include: { vehicle: true, stops: true } });
    if (!r) throw new NotFoundException('Route not found');
    return r;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.vehicleId) {
      const v = await this.prisma.transportVehicle.findFirst({ where: { id: dto.vehicleId, tenantId } });
      if (!v) throw new NotFoundException('Vehicle not found');
    }
    return this.prisma.transportRoute.update({ where: { id }, data: dto, include: { vehicle: true, stops: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.transportRoute.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const r = await this.prisma.transportRoute.findUnique({ where: { id } });
    if (!r || r.tenantId !== tenantId) throw new NotFoundException('Route not found');
    if (!r.deletedAt) throw new ConflictException('Route is not deleted');
    return this.prisma.transportRoute.update({ where: { id }, data: { deletedAt: null } });
  }
}