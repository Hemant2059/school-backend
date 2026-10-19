import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class ClassFeeStructureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
    if (!ay) throw new NotFoundException('Academic year not found');
    const gl = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
    if (!gl) throw new NotFoundException('Grade level not found');
    const fh = await this.prisma.feeHead.findFirst({ where: { id: dto.feeHeadId, tenantId } });
    if (!fh) throw new NotFoundException('Fee head not found');
    return this.prisma.classFeeStructure.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.classFeeStructure.findMany({ where: { tenantId, deletedAt: null }, include: { academicYear: true, gradeLevel: true, feeHead: true }, orderBy: { createdAt: 'desc' } });
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