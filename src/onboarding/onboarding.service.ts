import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

export interface OnboardingStep {
  code: string;
  label: string;
  description: string;
  done: boolean;
  count: number;
  /** Where a frontend sends the admin to finish this step. */
  action: { method: 'POST'; path: string };
}

export interface OnboardingStatus {
  steps: OnboardingStep[];
  completed: number;
  total: number;
  ready: boolean;
  /** The next unfinished step, or null when everything is done. */
  next: OnboardingStep | null;
}

/**
 * Where the school stands in setting itself up.
 *
 * A fresh school used to see an empty dashboard with no idea what to do
 * next. This answers "what must I configure before the school can run?"
 * with a checklist that is derived from the data, never from a flag.
 */
@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async status(tenantId: string): Promise<OnboardingStatus> {
    const [
      academicYears,
      currentAcademicYear,
      fiscalYears,
      activeFiscalYear,
      streams,
      gradeLevels,
      sections,
      subjects,
      gradeSubjects,
      gradingScales,
      feeHeads,
      feeStructures,
      staffProfiles,
      students,
      enrollments,
      guardiansWithUsers,
    ] = await Promise.all([
      this.prisma.academicYear.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.academicYear.count({ where: { tenantId, deletedAt: null, isCurrent: true } }),
      this.prisma.fiscalYear.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.fiscalYear.count({ where: { tenantId, deletedAt: null, isActive: true } }),
      this.prisma.stream.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.gradeLevel.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.section.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.subject.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.gradeSubject.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.gradingScale.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.feeHead.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.classFeeStructure.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.staffProfile.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.student.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.studentEnrollment.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.guardian.count({ where: { tenantId, deletedAt: null, userId: { not: null } } }),
    ]);

    const steps: OnboardingStep[] = [
      {
        code: 'academic_year',
        label: 'Academic year',
        description: 'Create the academic year and mark it current',
        done: currentAcademicYear > 0,
        count: academicYears,
        action: { method: 'POST', path: 'academic-years' },
      },
      {
        code: 'fiscal_year',
        label: 'Fiscal year',
        description: 'Create the Shrawan–Ashadh fiscal year and activate it',
        done: activeFiscalYear > 0,
        count: fiscalYears,
        action: { method: 'POST', path: 'fiscal-years' },
      },
      {
        code: 'stream',
        label: 'Streams',
        description: 'The NEB streams (Science, Management, Humanities, …)',
        done: streams > 0,
        count: streams,
        action: { method: 'POST', path: 'streams' },
      },
      {
        code: 'grade_level',
        label: 'Grade levels',
        description: 'Grades 8–12 with their IEMIS grade codes',
        done: gradeLevels > 0,
        count: gradeLevels,
        action: { method: 'POST', path: 'grade-levels' },
      },
      {
        code: 'section',
        label: 'Sections',
        description: 'At least one section per grade level',
        done: sections > 0,
        count: sections,
        action: { method: 'POST', path: 'sections' },
      },
      {
        code: 'subject',
        label: 'Subjects',
        description: 'All subjects taught at the school',
        done: subjects > 0,
        count: subjects,
        action: { method: 'POST', path: 'subjects' },
      },
      {
        code: 'grade_subjects',
        label: 'Curriculum',
        description: 'Marks/credits per grade × subject (grade-subjects)',
        done: gradeSubjects > 0,
        count: gradeSubjects,
        action: { method: 'POST', path: 'grade-subjects' },
      },
      {
        code: 'grading_scale',
        label: 'Grading scale',
        description: 'NEB letter-grade scale for results',
        done: gradingScales > 0,
        count: gradingScales,
        action: { method: 'POST', path: 'grading-scales' },
      },
      {
        code: 'fee_head',
        label: 'Fee heads',
        description: 'Tuition, exam, library, computer, etc.',
        done: feeHeads > 0,
        count: feeHeads,
        action: { method: 'POST', path: 'fee-heads' },
      },
      {
        code: 'class_fee_structure',
        label: 'Class fee structure',
        description: 'Which fee applies to which grade',
        done: feeStructures > 0,
        count: feeStructures,
        action: { method: 'POST', path: 'class-fee-structures' },
      },
      {
        code: 'staff_profile',
        label: 'Staff',
        description: 'Teachers and staff with salary packages',
        done: staffProfiles > 0,
        count: staffProfiles,
        action: { method: 'POST', path: 'staff-profiles' },
      },
      {
        code: 'students',
        label: 'Students',
        description: 'Students admitted (import via CSV or one by one)',
        done: students > 0,
        count: students,
        action: { method: 'POST', path: 'students/import' },
      },
      {
        code: 'enrollments',
        label: 'Enrollments',
        description: 'Students enrolled in sections — the school can now run',
        done: enrollments > 0,
        count: enrollments,
        action: { method: 'POST', path: 'enrollments' },
      },
      {
        code: 'guardians_linked',
        label: 'Parent accounts',
        description: 'At least one guardian linked to a login account (for the parent portal)',
        done: guardiansWithUsers > 0,
        count: guardiansWithUsers,
        action: { method: 'POST', path: 'guardians' },
      },
    ];

    const completed = steps.filter((s) => s.done).length;
    return {
      steps,
      completed,
      total: steps.length,
      ready: completed === steps.length,
      next: steps.find((s) => !s.done) ?? null,
    };
  }
}
