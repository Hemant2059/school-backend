import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StudentScholarshipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    const scheme = await this.prisma.scholarshipScheme.findFirst({ where: { id: dto.scholarshipSchemeId, tenantId } });
    if (!scheme) throw new NotFoundException('Scholarship scheme not found');
    const feeHead = await this.prisma.feeHead.findFirst({ where: { id: dto.feeHeadId, tenantId } });
    if (!feeHead) throw new NotFoundException('Fee head not found');
    return this.prisma.studentScholarship.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.studentScholarship.findMany({ where: { tenantId }, include: { enrollment: true, scholarshipScheme: true, feeHead: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const ss = await this.prisma.studentScholarship.findFirst({ where: { id, tenantId }, include: { enrollment: true, scholarshipScheme: true, feeHead: true } });
    if (!ss) throw new NotFoundException('Student scholarship not found');
    return ss;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.studentScholarship.update({ where: { id }, data: dto, include: { enrollment: true, scholarshipScheme: true, feeHead: true } });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentScholarship.delete({ where: { id } });
    return { deleted: true };
  }
}