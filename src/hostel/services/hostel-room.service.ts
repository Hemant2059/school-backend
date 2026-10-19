import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class HostelRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const hostel = await this.prisma.hostel.findFirst({ where: { id: dto.hostelId, tenantId } });
    if (!hostel) throw new NotFoundException('Hostel not found');
    return this.prisma.hostelRoom.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.hostelRoom.findMany({ where: { tenantId, deletedAt: null }, include: { hostel: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const room = await this.prisma.hostelRoom.findFirst({ where: { id, tenantId, deletedAt: null }, include: { hostel: true } });
    if (!room) throw new NotFoundException('Hostel room not found');
    return room;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.hostelId) {
      const hostel = await this.prisma.hostel.findFirst({ where: { id: dto.hostelId, tenantId } });
      if (!hostel) throw new NotFoundException('Hostel not found');
    }
    return this.prisma.hostelRoom.update({ where: { id }, data: dto, include: { hostel: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.hostelRoom.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const room = await this.prisma.hostelRoom.findUnique({ where: { id } });
    if (!room || room.tenantId !== tenantId) throw new NotFoundException('Hostel room not found');
    if (!room.deletedAt) throw new ConflictException('Hostel room is not deleted');
    return this.prisma.hostelRoom.update({ where: { id }, data: { deletedAt: null } });
  }
}