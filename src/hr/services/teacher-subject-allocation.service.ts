import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TeacherSubjectAllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
    if (!ay) throw new NotFoundException('Academic year not found');
    const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.staffId, tenantId } });
    if (!staff) throw new NotFoundException('Staff profile not found');
    const section = await this.prisma.section.findFirst({ where: { id: dto.sectionId, tenantId } });
    if (!section) throw new NotFoundException('Section not found');
    const subject = await this.prisma.subject.findFirst({ where: { id: dto.subjectId, tenantId } });
    if (!subject) throw new NotFoundException('Subject not found');
    return this.prisma.teacherSubjectAllocation.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.teacherSubjectAllocation.findMany({ where: { tenantId, deletedAt: null }, include: { academicYear: true, staff: true, section: true, subject: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const a = await this.prisma.teacherSubjectAllocation.findFirst({ where: { id, tenantId, deletedAt: null }, include: { academicYear: true, staff: true, section: true, subject: true } });
    if (!a) throw new NotFoundException('Allocation not found');
    return a;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.teacherSubjectAllocation.update({ where: { id }, data: dto, include: { academicYear: true, staff: true, section: true, subject: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.teacherSubjectAllocation.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const a = await this.prisma.teacherSubjectAllocation.findUnique({ where: { id } });
    if (!a || a.tenantId !== tenantId) throw new NotFoundException('Allocation not found');
    if (!a.deletedAt) throw new ConflictException('Allocation is not deleted');
    return this.prisma.teacherSubjectAllocation.update({ where: { id }, data: { deletedAt: null } });
  }
}