import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class HostelAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const hostel = await this.prisma.hostel.findFirst({ where: { id: dto.hostelId, tenantId } });
    if (!hostel) throw new NotFoundException('Hostel not found');
    const room = await this.prisma.hostelRoom.findFirst({ where: { id: dto.roomId, tenantId } });
    if (!room) throw new NotFoundException('Hostel room not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return this.prisma.hostelAllocation.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.hostelAllocation.findMany({ where: { tenantId, deletedAt: null }, include: { hostel: true, room: true, enrollment: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const alloc = await this.prisma.hostelAllocation.findFirst({ where: { id, tenantId, deletedAt: null }, include: { hostel: true, room: true, enrollment: true } });
    if (!alloc) throw new NotFoundException('Hostel allocation not found');
    return alloc;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.hostelId) {
      const hostel = await this.prisma.hostel.findFirst({ where: { id: dto.hostelId, tenantId } });
      if (!hostel) throw new NotFoundException('Hostel not found');
    }
    if (dto.roomId) {
      const room = await this.prisma.hostelRoom.findFirst({ where: { id: dto.roomId, tenantId } });
      if (!room) throw new NotFoundException('Hostel room not found');
    }
    return this.prisma.hostelAllocation.update({ where: { id }, data: dto, include: { hostel: true, room: true, enrollment: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.hostelAllocation.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const alloc = await this.prisma.hostelAllocation.findUnique({ where: { id } });
    if (!alloc || alloc.tenantId !== tenantId) throw new NotFoundException('Hostel allocation not found');
    if (!alloc.deletedAt) throw new ConflictException('Hostel allocation is not deleted');
    return this.prisma.hostelAllocation.update({ where: { id }, data: { deletedAt: null } });
  }
}