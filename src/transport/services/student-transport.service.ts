import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StudentTransportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    const route = await this.prisma.transportRoute.findFirst({ where: { id: dto.routeId, tenantId } });
    if (!route) throw new NotFoundException('Route not found');
    if (dto.stopId) {
      const stop = await this.prisma.transportStop.findFirst({ where: { id: dto.stopId, tenantId } });
      if (!stop) throw new NotFoundException('Stop not found');
    }
    if (dto.vehicleId) {
      const vehicle = await this.prisma.transportVehicle.findFirst({ where: { id: dto.vehicleId, tenantId } });
      if (!vehicle) throw new NotFoundException('Vehicle not found');
    }
    return this.prisma.studentTransport.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.studentTransport.findMany({ where: { tenantId, deletedAt: null }, include: { enrollment: true, route: true, stop: true, vehicle: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const st = await this.prisma.studentTransport.findFirst({ where: { id, tenantId, deletedAt: null }, include: { enrollment: true, route: true, stop: true, vehicle: true } });
    if (!st) throw new NotFoundException('Student transport not found');
    return st;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.studentTransport.update({ where: { id }, data: dto, include: { enrollment: true, route: true, stop: true, vehicle: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentTransport.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const st = await this.prisma.studentTransport.findUnique({ where: { id } });
    if (!st || st.tenantId !== tenantId) throw new NotFoundException('Student transport not found');
    if (!st.deletedAt) throw new ConflictException('Student transport is not deleted');
    return this.prisma.studentTransport.update({ where: { id }, data: { deletedAt: null } });
  }
}