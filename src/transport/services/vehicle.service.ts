import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.driverStaffId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.driverStaffId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }
    return this.prisma.transportVehicle.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.transportVehicle.findMany({ where: { tenantId, deletedAt: null }, include: { driver: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const v = await this.prisma.transportVehicle.findFirst({ where: { id, tenantId, deletedAt: null }, include: { driver: true } });
    if (!v) throw new NotFoundException('Vehicle not found');
    return v;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.driverStaffId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.driverStaffId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }
    return this.prisma.transportVehicle.update({ where: { id }, data: dto, include: { driver: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.transportVehicle.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const v = await this.prisma.transportVehicle.findUnique({ where: { id } });
    if (!v || v.tenantId !== tenantId) throw new NotFoundException('Vehicle not found');
    if (!v.deletedAt) throw new ConflictException('Vehicle is not deleted');
    return this.prisma.transportVehicle.update({ where: { id }, data: { deletedAt: null } });
  }
}