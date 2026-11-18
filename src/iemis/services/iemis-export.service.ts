import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { toCsv } from '../../common/utils/csv-writer.js';

/**
 * Exports the data a school needs to submit to the IEMIS portal.
 *
 * Every method returns the records with the field names the IEMIS portal
 * expects, or a CSV that can be pasted into it.
 */
@Injectable()
export class IemisExportService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------
  // Students
  // ---------------------------------------------------------------------

  async studentsJson(tenantId: string): Promise<any[]> {
    const students = await this.prisma.student.findMany({
      where: { tenantId, deletedAt: null },
      select: {
        id: true,
        admissionNo: true,
        iemisStudentId: true,
        nebRegistrationNo: true,
        symbolNo: true,
        firstNameEn: true,
        firstNameNe: true,
        middleNameEn: true,
        middleNameNe: true,
        lastNameEn: true,
        lastNameNe: true,
        dobAd: true,
        dobBs: true,
        gender: true,
        casteEthnicityCode: true,
        disabilityType: true,
        studentEnrollments: {
          where: { deletedAt: null },
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            rollNo: true,
            section: {
              select: {
                nameEn: true,
                gradeLevel: { select: { iemisGradeCode: true } },
              },
            },
            academicYear: { select: { bsYear: true } },
          },
        },
      },
    });

    return students.map((s) => ({
      id: s.id,
      iemisStudentId: s.iemisStudentId,
      nebRegistrationNo: s.nebRegistrationNo,
      symbolNo: s.symbolNo,
      admissionNo: s.admissionNo,
      firstName_en: s.firstNameEn,
      firstName_ne: s.firstNameNe,
      middleName_en: s.middleNameEn,
      middleName_ne: s.middleNameNe,
      lastName_en: s.lastNameEn,
      lastName_ne: s.lastNameNe,
      dobAD: s.dobAd?.toISOString().split('T')[0] ?? null,
      dobBS: s.dobBs,
      gender: s.gender,
      casteEthnicityCode: s.casteEthnicityCode,
      disabilityType: s.disabilityType,
      iemisGrade:
        s.studentEnrollments[0]?.section?.gradeLevel?.iemisGradeCode ?? null,
      section: s.studentEnrollments[0]?.section?.nameEn ?? null,
      rollNo: s.studentEnrollments[0]?.rollNo ?? null,
      bsYear: s.studentEnrollments[0]?.academicYear?.bsYear ?? null,
    }));
  }

  async studentsCsv(tenantId: string): Promise<string> {
    const data = await this.studentsJson(tenantId);
    return toCsv(
      [
        'admissionNo',
        'iemisStudentId',
        'firstName_en',
        'firstName_ne',
        'lastName_en',
        'lastName_ne',
        'dobAD',
        'dobBS',
        'gender',
        'casteEthnicityCode',
        'disabilityType',
        'iemisGrade',
        'section',
        'rollNo',
        'bsYear',
      ],
      data,
    );
  }

  // ---------------------------------------------------------------------
  // Teachers / staff
  // ---------------------------------------------------------------------

  async staffJson(tenantId: string): Promise<any[]> {
    const staff = await this.prisma.staffProfile.findMany({
      where: { tenantId, deletedAt: null },
      select: {
        id: true,
        iemisTeacherId: true,
        employeeCode: true,
        firstNameEn: true,
        firstNameNe: true,
        middleNameEn: true,
        middleNameNe: true,
        lastNameEn: true,
        lastNameNe: true,
        gender: true,
        staffCategory: true,
        employmentType: true,
        teachingLicenseNo: true,
        highestQualification: true,
        teacherTrainingStatus: true,
        panNumber: true,
        createdAt: true,
      },
    });

    return staff.map((s) => ({
      id: s.id,
      iemisTeacherId: s.iemisTeacherId,
      employeeCode: s.employeeCode,
      firstName_en: s.firstNameEn,
      firstName_ne: s.firstNameNe,
      middleName_en: s.middleNameEn,
      middleName_ne: s.middleNameNe,
      lastName_en: s.lastNameEn,
      lastName_ne: s.lastNameNe,
      gender: s.gender,
      staffCategory: s.staffCategory,
      employmentType: s.employmentType,
      teachingLicenseNo: s.teachingLicenseNo,
      highestQualification: s.highestQualification,
      teacherTrainingStatus: s.teacherTrainingStatus,
      panNumber: s.panNumber,
    }));
  }

  async staffCsv(tenantId: string): Promise<string> {
    const data = await this.staffJson(tenantId);
    return toCsv(
      [
        'employeeCode',
        'iemisTeacherId',
        'firstName_en',
        'lastName_en',
        'gender',
        'staffCategory',
        'employmentType',
        'teachingLicenseNo',
        'highestQualification',
        'teacherTrainingStatus',
      ],
      data,
    );
  }

  // ---------------------------------------------------------------------
  // Exam results
  // ---------------------------------------------------------------------

  async resultsJson(tenantId: string, academicYearId?: string) {
    const where: any = { tenantId };
    if (academicYearId) where.exam = { academicYearId };

    const marks = await this.prisma.examMark.findMany({
      where,
      include: {
        enrollment: {
          select: {
            studentId: true,
            student: {
              select: { iemisStudentId: true, admissionNo: true },
            },
          },
        },
        examSchedule: {
          select: {
            exam: { select: { name: true, academicYearId: true } },
            gradeSubject: {
              select: { subject: { select: { code: true, nameEn: true } } },
            },
          },
        },
      },
      take: 2000,
    });

    return marks.map((m) => ({
      iemisStudentId: m.enrollment?.student?.iemisStudentId,
      admissionNo: m.enrollment?.student?.admissionNo,
      examName: m.examSchedule?.exam?.name,
      subjectCode: m.examSchedule?.gradeSubject?.subject?.code,
      subjectName_en: m.examSchedule?.gradeSubject?.subject?.nameEn,
      theoryMarks: m.theoryMarksObtained,
      theoryAbsent: m.isTheoryAbsent,
      internalMarks: m.internalMarksObtained,
      internalAbsent: m.isInternalAbsent,
      finalGrade: m.finalSubjectGrade,
      finalGp: m.finalSubjectGp,
    }));
  }

  async resultsCsv(tenantId: string, academicYearId?: string): Promise<string> {
    const data = await this.resultsJson(tenantId, academicYearId);
    return toCsv(
      [
        'admissionNo',
        'iemisStudentId',
        'examName',
        'subjectCode',
        'subjectName_en',
        'theoryMarks',
        'theoryAbsent',
        'internalMarks',
        'finalGrade',
        'finalGp',
      ],
      data,
    );
  }

  // ---------------------------------------------------------------------
  // Scholarships
  // ---------------------------------------------------------------------

  async scholarshipsCsv(tenantId: string): Promise<string> {
    const scholarships = await this.prisma.studentScholarship.findMany({
      where: { tenantId },
      include: {
        enrollment: {
          include: {
            student: {
              select: { admissionNo: true, iemisStudentId: true },
            },
            academicYear: { select: { bsYear: true } },
          },
        },
        scholarshipScheme: {
          select: { name: true, iemisScholarshipType: true },
        },
      },
    });

    return toCsv(
      [
        'admissionNo',
        'iemisStudentId',
        'schemeName',
        'iemisScholarshipType',
        'bsYear',
        'discountType',
        'discountValue',
      ],
      scholarships.map((s) => ({
        admissionNo: s.enrollment?.student?.admissionNo,
        iemisStudentId: s.enrollment?.student?.iemisStudentId,
        schemeName: s.scholarshipScheme?.name,
        iemisScholarshipType: s.scholarshipScheme?.iemisScholarshipType,
        bsYear: s.enrollment?.academicYear?.bsYear,
        discountType: s.discountType,
        discountValue: s.discountValue?.toString(),
      })),
    );
  }
}
