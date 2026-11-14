import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import type {
  CreateTimetableSlotDto,
  QueryTimetableDto,
  UpdateTimetableSlotDto,
} from '../dto/timetable.dto.js';

/**
 * The weekly timetable.
 *
 * The model existed but nothing could write to it. The uniqueness rules
 * matter: a section cannot have two lessons in the same period, and a
 * teacher cannot be in two places at once.
 */
@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateTimetableSlotDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const section = await this.prisma.section.findFirst({
      where: { id: dto.sectionId, tenantId, deletedAt: null },
    });
    if (!section) throw new NotFoundException('Section not found');

    const subject = await this.prisma.subject.findFirst({
      where: { id: dto.subjectId, tenantId, deletedAt: null },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    const staff = await this.prisma.staffProfile.findFirst({
      where: { id: dto.staffId, tenantId, deletedAt: null },
    });
    if (!staff) throw new NotFoundException('Staff profile not found');

    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('The lesson must end after it starts');
    }

    // The teacher must actually teach this subject to this section.
    const allocation = await this.prisma.teacherSubjectAllocation.findFirst({
      where: {
        tenantId,
        staffId: dto.staffId,
        sectionId: dto.sectionId,
        subjectId: dto.subjectId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!allocation) {
      throw new BadRequestException(
        'This teacher is not allocated to teach that subject to that section',
      );
    }

    // The section cannot have two lessons in the same period.
    const sectionClash = await this.prisma.timetableSlot.findFirst({
      where: {
        tenantId,
        sectionId: dto.sectionId,
        dayOfWeek: dto.dayOfWeek,
        periodNo: dto.periodNo,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (sectionClash) {
      throw new ConflictException(
        'That section already has a lesson in this period',
      );
    }

    // The teacher cannot be in two places at once.
    const staffClash = await this.prisma.timetableSlot.findFirst({
      where: {
        tenantId,
        staffId: dto.staffId,
        dayOfWeek: dto.dayOfWeek,
        periodNo: dto.periodNo,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (staffClash) {
      throw new ConflictException('That teacher already teaches in this period');
    }

    return this.prisma.timetableSlot.create({
      data: { ...dto, tenantId },
      include: { subject: true, staff: true, section: true },
    });
  }

  async findAll(tenantId: string, query: QueryTimetableDto) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.staffId) where.staffId = query.staffId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.dayOfWeek) where.dayOfWeek = query.dayOfWeek;

    const [data, total] = await Promise.all([
      this.prisma.timetableSlot.findMany({
        where,
        include: { subject: true, staff: true, section: true },
        orderBy: [{ dayOfWeek: 'asc' }, { periodNo: 'asc' }],
        skip,
        take,
      }),
      this.prisma.timetableSlot.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  /** The timetable of one section, grouped by day. */
  async forSection(tenantId: string, sectionId: string) {
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId, tenantId, deletedAt: null },
    });
    if (!section) throw new NotFoundException('Section not found');

    const slots = await this.prisma.timetableSlot.findMany({
      where: { tenantId, sectionId, deletedAt: null },
      include: { subject: true, staff: true },
      orderBy: [{ dayOfWeek: 'asc' }, { periodNo: 'asc' }],
    });

    const byDay = new Map<number, typeof slots>();
    for (const slot of slots) {
      const list = byDay.get(slot.dayOfWeek) ?? [];
      list.push(slot);
      byDay.set(slot.dayOfWeek, list);
    }

    return {
      section: { id: section.id, nameEn: section.nameEn, nameNe: section.nameNe },
      days: [...byDay.entries()].map(([day, daySlots]) => ({
        dayOfWeek: day,
        slots: daySlots,
      })),
    };
  }

  async findOne(tenantId: string, id: string) {
    const slot = await this.prisma.timetableSlot.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { subject: true, staff: true, section: true },
    });
    if (!slot) throw new NotFoundException('Timetable slot not found');
    return slot;
  }

  async update(tenantId: string, id: string, dto: UpdateTimetableSlotDto) {
    await this.findOne(tenantId, id);

    if (dto.subjectId) {
      const subject = await this.prisma.subject.findFirst({
        where: { id: dto.subjectId, tenantId, deletedAt: null },
      });
      if (!subject) throw new NotFoundException('Subject not found');
    }
    if (dto.staffId) {
      const staff = await this.prisma.staffProfile.findFirst({
        where: { id: dto.staffId, tenantId, deletedAt: null },
      });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }

    return this.prisma.timetableSlot.update({
      where: { id },
      data: dto,
      include: { subject: true, staff: true, section: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.timetableSlot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const slot = await this.prisma.timetableSlot.findUnique({ where: { id } });
    if (!slot || slot.tenantId !== tenantId) {
      throw new NotFoundException('Timetable slot not found');
    }
    if (!slot.deletedAt) throw new NotFoundException('Timetable slot is not deleted');
    return this.prisma.timetableSlot.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
