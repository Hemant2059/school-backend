import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class HostelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.wardenStaffId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.wardenStaffId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }
    return this.prisma.hostel.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.hostel.findMany({ where: { tenantId, deletedAt: null }, include: { rooms: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const hostel = await this.prisma.hostel.findFirst({ where: { id, tenantId, deletedAt: null }, include: { rooms: true } });
    if (!hostel) throw new NotFoundException('Hostel not found');
    return hostel;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.wardenStaffId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.wardenStaffId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }
    return this.prisma.hostel.update({ where: { id }, data: dto, include: { rooms: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.hostel.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const hostel = await this.prisma.hostel.findUnique({ where: { id } });
    if (!hostel || hostel.tenantId !== tenantId) throw new NotFoundException('Hostel not found');
    if (!hostel.deletedAt) throw new ConflictException('Hostel is not deleted');
    return this.prisma.hostel.update({ where: { id }, data: { deletedAt: null } });
  }
}