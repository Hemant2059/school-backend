import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { DocumentSequenceService } from '../../common/services/document-sequence.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class TransferCertificateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sequences: DocumentSequenceService,
  ) {}

  /**
   * Issues a transfer certificate and marks the student as transferred out.
   *
   * `EnrollmentStatus.TRANSFERRED_OUT` used to be an enum member that no
   * code ever wrote, so a transferred student kept an active enrolment and
   * could still be invoiced and examined.
   */
  async create(tenantId: string, dto: any) {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');

    const existing = await this.prisma.transferCertificate.findFirst({
      where: { tenantId, studentId: dto.studentId, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('This student already has a transfer certificate');
    }

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { tenantId, studentId: dto.studentId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!enrollment) {
      throw new ConflictException('This student is not enrolled in this school');
    }

    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { tenantId, isActive: true, deletedAt: null },
      select: { id: true },
    });
    const tcNumber =
      dto.tcNumber ??
      (fiscalYear
        ? await this.sequences.next(tenantId, fiscalYear.id, 'TRANSFER_CERTIFICATE')
        : `TC-${Date.now()}`);

    return this.prisma.$transaction(async (tx) => {
      const certificate = await tx.transferCertificate.create({
        data: { ...dto, tenantId, tcNumber },
        include: { student: true },
      });

      await tx.studentEnrollment.update({
        where: { id: enrollment.id },
        data: { enrollmentStatus: EnrollmentStatus.TRANSFERRED_OUT },
      });

      return certificate;
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.studentId) where.studentId = query.studentId;

    const [data, total] = await Promise.all([
      this.prisma.transferCertificate.findMany({
        where,
        include: { student: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.transferCertificate.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const tc = await this.prisma.transferCertificate.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { student: true },
    });
    if (!tc) throw new NotFoundException('Transfer certificate not found');
    return tc;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.transferCertificate.update({
      where: { id },
      data: dto,
      include: { student: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.transferCertificate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const tc = await this.prisma.transferCertificate.findUnique({ where: { id } });
    if (!tc || tc.tenantId !== tenantId) throw new NotFoundException('Transfer certificate not found');
    if (!tc.deletedAt) throw new ConflictException('Transfer certificate is not deleted');
    return this.prisma.transferCertificate.update({
      where: { id },
      data: { deletedAt: null },
      include: { student: true },
    });
  }
}
