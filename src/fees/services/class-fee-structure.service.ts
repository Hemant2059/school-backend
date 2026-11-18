import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { paginatedQuery } from '../../common/utils/paginated-query.js';

@Injectable()
export class ClassFeeStructureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId, deletedAt: null },
    });
    if (!ay) throw new NotFoundException('Academic year not found');
    const gl = await this.prisma.gradeLevel.findFirst({
      where: { id: dto.gradeLevelId, tenantId, deletedAt: null },
    });
    if (!gl) throw new NotFoundException('Grade level not found');
    const fh = await this.prisma.feeHead.findFirst({
      where: { id: dto.feeHeadId, tenantId, deletedAt: null },
    });
    if (!fh) throw new NotFoundException('Fee head not found');
    if (dto.fiscalYearId) {
      const fy = await this.prisma.fiscalYear.findFirst({
        where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
      });
      if (!fy) throw new NotFoundException('Fiscal year not found');
    }

    // A monthly fee head must say which months it covers, otherwise the
    // invoice generator cannot expand it into lines.
    if (fh.frequency === 'MONTHLY_BS' && !(dto.applicableBsMonths ?? []).length) {
      throw new BadRequestException(
        'A monthly fee head needs the Bikram Sambat months it applies to',
      );
    }

    try {
      return await this.prisma.classFeeStructure.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'A fee structure for this class, year and fee head already exists',
        );
      }
      throw e;
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    return paginatedQuery(
      this.prisma.classFeeStructure,
      { where: { tenantId, deletedAt: null }, include: { academicYear: true, gradeLevel: true, feeHead: true }, orderBy: { createdAt: 'desc' } },
      query,
    );
  }

  async findOne(tenantId: string, id: string) {
    const cfs = await this.prisma.classFeeStructure.findFirst({ where: { id, tenantId, deletedAt: null }, include: { academicYear: true, gradeLevel: true, feeHead: true } });
    if (!cfs) throw new NotFoundException('Class fee structure not found');
    return cfs;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.classFeeStructure.update({ where: { id }, data: dto, include: { academicYear: true, gradeLevel: true, feeHead: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.classFeeStructure.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const cfs = await this.prisma.classFeeStructure.findUnique({ where: { id } });
    if (!cfs || cfs.tenantId !== tenantId) throw new NotFoundException('Class fee structure not found');
    if (!cfs.deletedAt) throw new ConflictException('Class fee structure is not deleted');
    return this.prisma.classFeeStructure.update({ where: { id }, data: { deletedAt: null } });
  }
}