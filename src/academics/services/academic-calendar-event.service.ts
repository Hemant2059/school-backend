import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { paginatedQuery } from '../../common/utils/paginated-query.js';
import { csvToRecords } from '../../common/utils/csv.js';

@Injectable()
export class AcademicCalendarEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, academicYearId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({
      where: { id: academicYearId, tenantId },
    });
    if (!ay) throw new NotFoundException('Academic year not found');
    return this.prisma.academicCalendarEvent.create({
      data: { ...dto, tenantId, academicYearId },
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    return paginatedQuery(
      this.prisma.academicCalendarEvent,
      { where: { tenantId, deletedAt: null }, orderBy: { dateAd: 'asc' } },
      query,
    );
  }

  async findOne(tenantId: string, id: string) {
    const ev = await this.prisma.academicCalendarEvent.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!ev) throw new NotFoundException('Academic calendar event not found');
    return ev;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.academicCalendarEvent.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Imports academic calendar events (e.g. holidays) from CSV text.
   *
   * Expected header (case-insensitive):
   *   dateAd,dateBs,titleEn,titleNe,isHoliday
   * Only `dateAd` and `titleEn` are required. `dateBs` keeps the original
   * BS date string verbatim (no conversion is performed). `isHoliday`
   * accepts true/false/yes/no/1/0, default true.
   *
   * Rows that fail validation are reported in `errors` and do not abort
   * the import. Rows that already exist (same academic year, date and
   * title) are counted as `duplicates` and skipped.
   */
  async importCsv(
    tenantId: string,
    academicYearId: string | undefined,
    csv: string,
  ) {
    if (!academicYearId) {
      throw new BadRequestException(
        'academicYearId is required (query parameter)',
      );
    }
    if (!csv || !csv.trim()) {
      throw new BadRequestException('CSV body is empty');
    }

    const ay = await this.prisma.academicYear.findFirst({
      where: { id: academicYearId, tenantId },
    });
    if (!ay) throw new NotFoundException('Academic year not found');

    let records;
    try {
      records = csvToRecords(csv, { maxRows: 1001 });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid CSV',
      );
    }
    if (records.length === 0) {
      throw new BadRequestException('CSV contains no data rows');
    }
    if (records.length > 1000) {
      throw new BadRequestException('CSV exceeds the 1000 row limit');
    }

    const truthy = new Set(['true', 'yes', '1']);
    const falsy = new Set(['false', 'no', '0']);
    const errors: Array<{ line: number; message: string }> = [];
    const valid: Array<{
      line: number;
      dateAd: Date;
      dateBs: string;
      titleEn: string;
      titleNe: string;
      isHoliday: boolean;
    }> = [];

    for (const record of records) {
      const v = record.values;
      const line = record.line;

      const rawDate = v['datead'] ?? v['date'] ?? '';
      const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDate);
      if (!dateMatch) {
        errors.push({
          line,
          message: `dateAd must be YYYY-MM-DD, got "${rawDate}"`,
        });
        continue;
      }
      const [, ys, ms, ds] = dateMatch;
      const date = new Date(Date.UTC(Number(ys), Number(ms) - 1, Number(ds)));
      if (date.toISOString().slice(0, 10) !== rawDate) {
        errors.push({
          line,
          message: `dateAd is not a real calendar date: "${rawDate}"`,
        });
        continue;
      }

      const titleEn = v['titleen'] ?? v['title'] ?? '';
      if (!titleEn) {
        errors.push({ line, message: 'titleEn is required' });
        continue;
      }
      if (titleEn.length > 100) {
        errors.push({ line, message: 'titleEn exceeds 100 characters' });
        continue;
      }

      const rawHoliday = (v['isholiday'] ?? '').toLowerCase();
      let isHoliday = true;
      if (rawHoliday) {
        if (truthy.has(rawHoliday)) isHoliday = true;
        else if (falsy.has(rawHoliday)) isHoliday = false;
        else {
          errors.push({
            line,
            message: `isHoliday must be true/false/yes/no/1/0, got "${rawHoliday}"`,
          });
          continue;
        }
      }

      const dateBs = (v['datebs'] ?? '').slice(0, 10);
      const titleNe = v['titlene'] ?? '';

      valid.push({ line, dateAd: date, dateBs, titleEn, titleNe, isHoliday });
    }

    let duplicates = 0;
    let created = 0;
    if (valid.length > 0) {
      const dates = valid.map((r) => r.dateAd);
      const existing = await this.prisma.academicCalendarEvent.findMany({
        where: {
          tenantId,
          academicYearId,
          deletedAt: null,
          dateAd: { in: dates },
        },
        select: { dateAd: true, titleEn: true },
      });
      const existingKeys = new Set(
        existing.map(
          (e) =>
            `${e.dateAd.toISOString().slice(0, 10)}::${e.titleEn.toLowerCase()}`,
        ),
      );

      const toCreate = valid.filter((r) => {
        const key = `${r.dateAd.toISOString().slice(0, 10)}::${r.titleEn.toLowerCase()}`;
        if (existingKeys.has(key)) {
          duplicates++;
          return false;
        }
        return true;
      });

      if (toCreate.length > 0) {
        await this.prisma.$transaction(
          toCreate.map((r) =>
            this.prisma.academicCalendarEvent.create({
              data: {
                tenantId,
                academicYearId,
                dateAd: r.dateAd,
                dateBs: r.dateBs,
                titleEn: r.titleEn,
                titleNe: r.titleNe,
                isHoliday: r.isHoliday,
              },
            }),
          ),
        );
        created = toCreate.length;
      }
    }

    return {
      academicYearId,
      total: records.length,
      created,
      duplicates,
      errors,
    };
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.academicCalendarEvent.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const ev = await this.prisma.academicCalendarEvent.findUnique({
      where: { id },
    });
    if (!ev || ev.tenantId !== tenantId)
      throw new NotFoundException('Academic calendar event not found');
    if (!ev.deletedAt) throw new ConflictException('Event is not deleted');
    return this.prisma.academicCalendarEvent.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
