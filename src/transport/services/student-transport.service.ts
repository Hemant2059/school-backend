import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class StudentTransportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const route = await this.prisma.transportRoute.findFirst({
      where: { id: dto.routeId, tenantId, deletedAt: null },
    });
    if (!route) throw new NotFoundException('Route not found');

    let stop = null;
    if (dto.stopId) {
      stop = await this.prisma.transportStop.findFirst({
        where: { id: dto.stopId, tenantId, deletedAt: null },
      });
      if (!stop) throw new NotFoundException('Stop not found');
      // The stop must be on the route the student is enrolled in.
      if (stop.routeId !== route.id) {
        throw new ConflictException('The selected stop does not belong to this route');
      }
    }

    let vehicle = null;
    if (dto.vehicleId) {
      vehicle = await this.prisma.transportVehicle.findFirst({
        where: { id: dto.vehicleId, tenantId, deletedAt: null },
      });
      if (!vehicle) throw new NotFoundException('Vehicle not found');
    }

    // A student may hold only one active seat.
    const existing = await this.prisma.studentTransport.findFirst({
      where: { tenantId, enrollmentId: dto.enrollmentId, status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('This student already has an active transport allocation');
    }

    if (vehicle) {
      await this.assertVehicleCapacity(tenantId, vehicle.id, vehicle.capacity);
    }

    return this.prisma.studentTransport.create({
      data: { ...dto, tenantId, status: dto.status ?? 'ACTIVE' },
      include: { enrollment: true, route: true, stop: true, vehicle: true },
    });
  }

  /**
   * Enforces the vehicle capacity. `capacity` was previously a write-only
   * field, so a 30-seat bus could be assigned to two hundred students.
   */
  private async assertVehicleCapacity(
    tenantId: string,
    vehicleId: string,
    capacity: number | null,
  ): Promise<void> {
    if (capacity === null) return;
    const occupancy = await this.prisma.studentTransport.count({
      where: { tenantId, vehicleId, status: 'ACTIVE', deletedAt: null },
    });
    if (occupancy >= capacity) {
      throw new ConflictException(
        `This vehicle is full (${occupancy}/${capacity} seats)`,
      );
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.routeId) where.routeId = query.routeId;
    if (query.vehicleId) where.vehicleId = query.vehicleId;
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.studentTransport.findMany({
        where,
        include: { enrollment: true, route: true, stop: true, vehicle: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.studentTransport.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const st = await this.prisma.studentTransport.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { enrollment: true, route: true, stop: true, vehicle: true },
    });
    if (!st) throw new NotFoundException('Student transport not found');
    return st;
  }

  async update(tenantId: string, id: string, dto: any) {
    const current = await this.findOne(tenantId, id);

    // The update path previously performed no validation at all, so a
    // route, stop or vehicle belonging to another tenant could be attached.
    if (dto.routeId) {
      const route = await this.prisma.transportRoute.findFirst({
        where: { id: dto.routeId, tenantId, deletedAt: null },
      });
      if (!route) throw new NotFoundException('Route not found');
    }
    if (dto.stopId) {
      const stop = await this.prisma.transportStop.findFirst({
        where: { id: dto.stopId, tenantId, deletedAt: null },
      });
      if (!stop) throw new NotFoundException('Stop not found');
      const routeId = dto.routeId ?? current.routeId;
      if (stop.routeId !== routeId) {
        throw new ConflictException('The selected stop does not belong to this route');
      }
    }
    if (dto.vehicleId) {
      const vehicle = await this.prisma.transportVehicle.findFirst({
        where: { id: dto.vehicleId, tenantId, deletedAt: null },
      });
      if (!vehicle) throw new NotFoundException('Vehicle not found');
      await this.assertVehicleCapacity(tenantId, vehicle.id, vehicle.capacity);
    }

    return this.prisma.studentTransport.update({
      where: { id },
      data: dto,
      include: { enrollment: true, route: true, stop: true, vehicle: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentTransport.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'CANCELLED' },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const st = await this.prisma.studentTransport.findUnique({ where: { id } });
    if (!st || st.tenantId !== tenantId) throw new NotFoundException('Student transport not found');
    if (!st.deletedAt) throw new ConflictException('Student transport is not deleted');
    return this.prisma.studentTransport.update({
      where: { id },
      data: { deletedAt: null, status: 'ACTIVE' },
    });
  }
}
