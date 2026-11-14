import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class GradingScaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.gradingScale.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
    }
    const [data, total] = await Promise.all([
      this.prisma.gradingScale.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.gradingScale.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const gs = await this.prisma.gradingScale.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { items: true },
    });
    if (!gs) throw new NotFoundException('Grading scale not found');
    return gs;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.gradingScale.update({
      where: { id },
      data: dto,
      include: { items: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.gradingScale.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const gs = await this.prisma.gradingScale.findUnique({ where: { id } });
    if (!gs || gs.tenantId !== tenantId) throw new NotFoundException('Grading scale not found');
    if (!gs.deletedAt) throw new ConflictException('Grading scale is not deleted');
    return this.prisma.gradingScale.update({
      where: { id },
      data: { deletedAt: null },
      include: { items: true },
    });
  }

  // -------------------------------------------------------------------
  // Items
  //
  // The item endpoints previously took no `tenantId` at all: they looked the
  // item up by id alone, so a school tenant could add, change or delete a
  // grade band belonging to a different school.
  // -------------------------------------------------------------------

  async createItem(tenantId: string, gradingScaleId: string, dto: any) {
    const gs = await this.prisma.gradingScale.findFirst({
      where: { id: gradingScaleId, tenantId, deletedAt: null },
    });
    if (!gs) throw new NotFoundException('Grading scale not found');
    this.assertBandIsSane(dto);

    return this.prisma.gradingScaleItem.create({
      data: {
        gradingScaleId,
        minPercentage: dto.minPercentage,
        maxPercentage: dto.maxPercentage,
        letterGrade: dto.letterGrade,
        gradePoint: dto.gradePoint,
        descriptorEn: dto.descriptorEn,
        descriptorNp: dto.descriptorNp,
      },
    });
  }

  async updateItem(tenantId: string, itemId: string, dto: any) {
    const item = await this.findItemInTenant(tenantId, itemId);
    this.assertBandIsSane({
      minPercentage: dto.minPercentage ?? item.minPercentage,
      maxPercentage: dto.maxPercentage ?? item.maxPercentage,
      gradePoint: dto.gradePoint ?? item.gradePoint,
    });

    return this.prisma.gradingScaleItem.update({
      where: { id: itemId },
      data: {
        minPercentage: dto.minPercentage,
        maxPercentage: dto.maxPercentage,
        letterGrade: dto.letterGrade,
        gradePoint: dto.gradePoint,
        descriptorEn: dto.descriptorEn,
        descriptorNp: dto.descriptorNp,
      },
    });
  }

  async removeItem(tenantId: string, itemId: string) {
    await this.findItemInTenant(tenantId, itemId);
    await this.prisma.gradingScaleItem.delete({ where: { id: itemId } });
    return { deleted: true };
  }

  /** Resolves a grade band belonging to this tenant. */
  private async findItemInTenant(tenantId: string, itemId: string) {
    const item = await this.prisma.gradingScaleItem.findFirst({
      where: { id: itemId, gradingScale: { tenantId } },
    });
    if (!item) throw new NotFoundException('Grading scale item not found');
    return item;
  }

  private assertBandIsSane(band: {
    minPercentage?: number;
    maxPercentage?: number;
    gradePoint?: number;
  }): void {
    if (band.minPercentage !== undefined && band.maxPercentage !== undefined) {
      if (band.minPercentage > band.maxPercentage) {
        throw new ConflictException(
          'The minimum percentage of a grade band cannot exceed its maximum',
        );
      }
    }
  }
}
