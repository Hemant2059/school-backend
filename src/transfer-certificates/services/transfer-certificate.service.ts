import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TransferCertificateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, tenantId } });
    if (!student) throw new NotFoundException('Student not found');
    try {
      return await this.prisma.transferCertificate.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('TC number already exists');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.transferCertificate.findMany({ where: { tenantId, deletedAt: null }, include: { student: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const tc = await this.prisma.transferCertificate.findFirst({ where: { id, tenantId, deletedAt: null }, include: { student: true } });
    if (!tc) throw new NotFoundException('Transfer certificate not found');
    return tc;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.transferCertificate.update({ where: { id }, data: dto, include: { student: true } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('TC number already exists');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.transferCertificate.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const tc = await this.prisma.transferCertificate.findUnique({ where: { id } });
    if (!tc || tc.tenantId !== tenantId) throw new NotFoundException('Transfer certificate not found');
    if (!tc.deletedAt) throw new ConflictException('Transfer certificate is not deleted');
    return this.prisma.transferCertificate.update({ where: { id }, data: { deletedAt: null } });
  }
}