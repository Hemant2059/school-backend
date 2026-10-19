import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    try {
      return await this.prisma.student.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Admission number already exists');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.student.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const student = await this.prisma.student.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.student.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Admission number already exists');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.student.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student || student.tenantId !== tenantId) throw new NotFoundException('Student not found');
    if (!student.deletedAt) throw new ConflictException('Student is not deleted');
    return this.prisma.student.update({ where: { id }, data: { deletedAt: null } });
  }
}