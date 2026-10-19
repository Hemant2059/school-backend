import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    try {
      return await this.prisma.subject.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Subject code already exists');
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.subject.findMany({ where: { tenantId, deletedAt: null }, orderBy: { code: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const s = await this.prisma.subject.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!s) throw new NotFoundException('Subject not found');
    return s;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.subject.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Subject code already exists');
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.subject.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const s = await this.prisma.subject.findUnique({ where: { id } });
    if (!s || s.tenantId !== tenantId) throw new NotFoundException('Subject not found');
    if (!s.deletedAt) throw new ConflictException('Subject is not deleted');
    return this.prisma.subject.update({ where: { id }, data: { deletedAt: null } });
  }
}