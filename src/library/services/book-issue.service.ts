import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class BookIssueService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const book = await this.prisma.libraryBook.findFirst({ where: { id: dto.bookId, tenantId } });
    if (!book) throw new NotFoundException('Library book not found');
    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, tenantId } });
    if (!student) throw new NotFoundException('Student not found');
    return this.prisma.bookIssue.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.bookIssue.findMany({ where: { tenantId, deletedAt: null }, include: { book: true, student: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const issue = await this.prisma.bookIssue.findFirst({ where: { id, tenantId, deletedAt: null }, include: { book: true, student: true } });
    if (!issue) throw new NotFoundException('Book issue not found');
    return issue;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.bookIssue.update({ where: { id }, data: dto, include: { book: true, student: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.bookIssue.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const issue = await this.prisma.bookIssue.findUnique({ where: { id } });
    if (!issue || issue.tenantId !== tenantId) throw new NotFoundException('Book issue not found');
    if (!issue.deletedAt) throw new ConflictException('Book issue is not deleted');
    return this.prisma.bookIssue.update({ where: { id }, data: { deletedAt: null } });
  }
}