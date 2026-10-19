import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class AcademicCalendarEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, academicYearId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({ where: { id: academicYearId, tenantId } });
    if (!ay) throw new NotFoundException('Academic year not found');
    return this.prisma.academicCalendarEvent.create({ data: { ...dto, tenantId, academicYearId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.academicCalendarEvent.findMany({ where: { tenantId, deletedAt: null }, orderBy: { dateAd: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const ev = await this.prisma.academicCalendarEvent.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!ev) throw new NotFoundException('Academic calendar event not found');
    return ev;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.academicCalendarEvent.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.academicCalendarEvent.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const ev = await this.prisma.academicCalendarEvent.findUnique({ where: { id } });
    if (!ev || ev.tenantId !== tenantId) throw new NotFoundException('Academic calendar event not found');
    if (!ev.deletedAt) throw new ConflictException('Event is not deleted');
    return this.prisma.academicCalendarEvent.update({ where: { id }, data: { deletedAt: null } });
  }
}
