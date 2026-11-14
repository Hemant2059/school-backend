import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class HostelAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const hostel = await this.prisma.hostel.findFirst({
      where: { id: dto.hostelId, tenantId, deletedAt: null },
    });
    if (!hostel) throw new NotFoundException('Hostel not found');

    const room = await this.prisma.hostelRoom.findFirst({
      where: { id: dto.roomId, tenantId, deletedAt: null },
    });
    if (!room) throw new NotFoundException('Hostel room not found');

    // The room must belong to the hostel that was named.
    if (room.hostelId !== hostel.id) {
      throw new ConflictException('The selected room does not belong to this hostel');
    }

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    // A student may hold only one active bed.
    const existing = await this.prisma.hostelAllocation.findFirst({
      where: { tenantId, enrollmentId: dto.enrollmentId, status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('This student already has an active hostel allocation');
    }

    await this.assertCapacity(tenantId, hostel, room);

    return this.prisma.hostelAllocation.create({
      data: { ...dto, tenantId, status: dto.status ?? 'ACTIVE' },
      include: { hostel: true, room: true, enrollment: true },
    });
  }

  /**
   * Enforces the room and hostel capacities.
   *
   * `capacity` was a write-only field: it was validated by the DTO and then
   * never used, so a room of capacity 1 could hold fifty students.
   */
  private async assertCapacity(
    tenantId: string,
    hostel: { id: string; capacity: number | null },
    room: { id: string; capacity: number | null },
  ): Promise<void> {
    const roomOccupancy = await this.prisma.hostelAllocation.count({
      where: { tenantId, roomId: room.id, status: 'ACTIVE', deletedAt: null },
    });
    if (room.capacity !== null && roomOccupancy >= room.capacity) {
      throw new ConflictException(
        `This room is full (${roomOccupancy}/${room.capacity} places)`,
      );
    }

    if (hostel.capacity !== null) {
      const hostelOccupancy = await this.prisma.hostelAllocation.count({
        where: { tenantId, hostelId: hostel.id, status: 'ACTIVE', deletedAt: null },
      });
      if (hostelOccupancy >= hostel.capacity) {
        throw new ConflictException(
          `This hostel is full (${hostelOccupancy}/${hostel.capacity} places)`,
        );
      }
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.hostelId) where.hostelId = query.hostelId;
    if (query.roomId) where.roomId = query.roomId;
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.hostelAllocation.findMany({
        where,
        include: { hostel: true, room: true, enrollment: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.hostelAllocation.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const alloc = await this.prisma.hostelAllocation.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { hostel: true, room: true, enrollment: true },
    });
    if (!alloc) throw new NotFoundException('Hostel allocation not found');
    return alloc;
  }

  async update(tenantId: string, id: string, dto: any) {
    const alloc = await this.findOne(tenantId, id);

    let hostel = null;
    if (dto.hostelId) {
      hostel = await this.prisma.hostel.findFirst({
        where: { id: dto.hostelId, tenantId, deletedAt: null },
      });
      if (!hostel) throw new NotFoundException('Hostel not found');
    }
    let room = null;
    if (dto.roomId) {
      room = await this.prisma.hostelRoom.findFirst({
        where: { id: dto.roomId, tenantId, deletedAt: null },
      });
      if (!room) throw new NotFoundException('Hostel room not found');
    }
    if (hostel && room && room.hostelId !== hostel.id) {
      throw new ConflictException('The selected room does not belong to this hostel');
    }
    if (room) {
      await this.assertCapacity(tenantId, hostel ?? { id: alloc.hostelId, capacity: null }, room);
    }

    return this.prisma.hostelAllocation.update({
      where: { id },
      data: dto,
      include: { hostel: true, room: true, enrollment: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.hostelAllocation.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'VACATED' },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const alloc = await this.prisma.hostelAllocation.findUnique({ where: { id } });
    if (!alloc || alloc.tenantId !== tenantId) throw new NotFoundException('Hostel allocation not found');
    if (!alloc.deletedAt) throw new ConflictException('Hostel allocation is not deleted');
    return this.prisma.hostelAllocation.update({
      where: { id },
      data: { deletedAt: null, status: 'ACTIVE' },
    });
  }
}
