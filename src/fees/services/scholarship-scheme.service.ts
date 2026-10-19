import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class ScholarshipSchemeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.scholarshipScheme.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.scholarshipScheme.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const scheme = await this.prisma.scholarshipScheme.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!scheme) throw new NotFoundException('Scholarship scheme not found');
    return scheme;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.scholarshipScheme.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.scholarshipScheme.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const scheme = await this.prisma.scholarshipScheme.findUnique({ where: { id } });
    if (!scheme || scheme.tenantId !== tenantId) throw new NotFoundException('Scholarship scheme not found');
    if (!scheme.deletedAt) throw new ConflictException('Scholarship scheme is not deleted');
    return this.prisma.scholarshipScheme.update({ where: { id }, data: { deletedAt: null } });
  }
}