import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { GuardianNotificationService } from '../../notifications/services/guardian-notification.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly guardianNotify: GuardianNotificationService,
  ) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');

    const ay = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId, deletedAt: null },
    });
    if (!ay) throw new NotFoundException('Academic year not found');

    const gl = await this.prisma.gradeLevel.findFirst({
      where: { id: dto.gradeLevelId, tenantId, deletedAt: null },
    });
    if (!gl) throw new NotFoundException('Grade level not found');

    const section = await this.prisma.section.findFirst({
      where: { id: dto.sectionId, tenantId, deletedAt: null },
    });
    if (!section) throw new NotFoundException('Section not found');

    // The section must belong to the grade level and the academic year that
    // were named. Previously the two were validated independently, so an
    // enrolment could pair a Grade 1 student with a Grade 10 section.
    if (section.gradeLevelId !== gl.id) {
      throw new ConflictException(
        'The selected section does not belong to the given grade level',
      );
    }
    if (section.academicYearId && section.academicYearId !== ay.id) {
      throw new ConflictException(
        'The selected section belongs to a different academic year',
      );
    }

    // A student may hold only one active enrolment per academic year.
    const existing = await this.prisma.studentEnrollment.findFirst({
      where: {
        tenantId,
        studentId: dto.studentId,
        academicYearId: dto.academicYearId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        'This student is already enrolled for the given academic year',
      );
    }

    // The roll number must be free within the section.
    const rollTaken = await this.prisma.studentEnrollment.findFirst({
      where: {
        tenantId,
        sectionId: dto.sectionId,
        rollNo: dto.rollNo,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (rollTaken) {
      throw new ConflictException(
        `Roll number ${dto.rollNo} is already in use in this section`,
      );
    }

    await this.assertSectionCapacity(tenantId, section.id, section.capacity);

    let enrollment;
    try {
      enrollment = await this.prisma.studentEnrollment.create({
        data: { ...dto, tenantId },
        include: { student: true, academicYear: true, gradeLevel: true, section: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Enrollment already exists for this student and academic year',
        );
      }
      throw e;
    }

    // Best-effort: tell the guardian(s) their child is enrolled. A delivery
    // failure must never block the admission itself.
    try {
      await this.guardianNotify.notifyForStudent(tenantId, enrollment.studentId, {
        title: 'Admission confirmed',
        message: `${enrollment.student.firstNameEn} ${enrollment.student.lastNameEn} is enrolled in ${enrollment.gradeLevel.nameEn} ${enrollment.section.nameEn} for ${enrollment.academicYear.name} (Roll ${enrollment.rollNo}).`,
        smsText: `Admission: ${enrollment.student.firstNameEn} ${enrollment.student.lastNameEn} enrolled in ${enrollment.gradeLevel.nameEn}-${enrollment.section.nameEn} for ${enrollment.academicYear.name}. Roll ${enrollment.rollNo}.`,
        type: 'admission',
      });
    } catch {
      // notification failures are counted/logged inside the helper
    }

    return enrollment;
  }

  /** Enforces the section capacity, which was previously never checked. */
  private async assertSectionCapacity(
    tenantId: string,
    sectionId: string,
    capacity: number | null,
  ): Promise<void> {
    if (capacity === null) return;
    const enrolled = await this.prisma.studentEnrollment.count({
      where: { tenantId, sectionId, deletedAt: null },
    });
    if (enrolled >= capacity) {
      throw new ConflictException(
        `This section is full (${enrolled}/${capacity} seats)`,
      );
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.academicYearId) where.academicYearId = query.academicYearId;
    if (query.gradeLevelId) where.gradeLevelId = query.gradeLevelId;
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.enrollmentStatus) where.enrollmentStatus = query.enrollmentStatus;

    const [data, total] = await Promise.all([
      this.prisma.studentEnrollment.findMany({
        where,
        include: { student: true, academicYear: true, gradeLevel: true, section: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.studentEnrollment.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const enr = await this.prisma.studentEnrollment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { student: true, academicYear: true, gradeLevel: true, section: true },
    });
    if (!enr) throw new NotFoundException('Enrollment not found');
    return enr;
  }

  async update(tenantId: string, id: string, dto: any) {
    const current = await this.findOne(tenantId, id);

    let section = null;
    if (dto.sectionId) {
      section = await this.prisma.section.findFirst({
        where: { id: dto.sectionId, tenantId, deletedAt: null },
      });
      if (!section) throw new NotFoundException('Section not found');
    }
    if (dto.gradeLevelId) {
      const gl = await this.prisma.gradeLevel.findFirst({
        where: { id: dto.gradeLevelId, tenantId, deletedAt: null },
      });
      if (!gl) throw new NotFoundException('Grade level not found');
    }
    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({
        where: { id: dto.academicYearId, tenantId, deletedAt: null },
      });
      if (!ay) throw new NotFoundException('Academic year not found');
    }

    const gradeLevelId = dto.gradeLevelId ?? current.gradeLevelId;
    const academicYearId = dto.academicYearId ?? current.academicYearId;
    if (section) {
      if (section.gradeLevelId !== gradeLevelId) {
        throw new ConflictException(
          'The selected section does not belong to the given grade level',
        );
      }
      if (section.academicYearId && section.academicYearId !== academicYearId) {
        throw new ConflictException(
          'The selected section belongs to a different academic year',
        );
      }
    }

    if (dto.rollNo !== undefined && dto.rollNo !== current.rollNo) {
      const rollTaken = await this.prisma.studentEnrollment.findFirst({
        where: {
          tenantId,
          sectionId: dto.sectionId ?? current.sectionId,
          rollNo: dto.rollNo,
          id: { not: id },
          deletedAt: null,
        },
        select: { id: true },
      });
      if (rollTaken) {
        throw new ConflictException(
          `Roll number ${dto.rollNo} is already in use in this section`,
        );
      }
    }

    try {
      return await this.prisma.studentEnrollment.update({
        where: { id },
        data: dto,
        include: { student: true, academicYear: true, gradeLevel: true, section: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'Enrollment already exists for this student and academic year',
        );
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentEnrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const enr = await this.prisma.studentEnrollment.findUnique({ where: { id } });
    if (!enr || enr.tenantId !== tenantId) throw new NotFoundException('Enrollment not found');
    if (!enr.deletedAt) throw new ConflictException('Enrollment is not deleted');
    return this.prisma.studentEnrollment.update({
      where: { id },
      data: { deletedAt: null },
      include: { student: true, academicYear: true, gradeLevel: true, section: true },
    });
  }
}
