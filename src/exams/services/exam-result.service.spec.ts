import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '../../generated/prisma/client.js';
import { ExamResultService } from './exam-result.service.js';

function makePrisma() {
  return {
    exam: { findFirst: vi.fn() },
    examSchedule: { findMany: vi.fn() },
    studentExamSummary: { upsert: vi.fn(), update: vi.fn(), findFirst: vi.fn() },
    studentDailyAttendance: { findMany: vi.fn() },
    studentEnrollment: { findFirst: vi.fn(), findMany: vi.fn() },
    examMark: { findUnique: vi.fn() },
  } as any;
}

/** Uses the real Prisma.Decimal so the arithmetic matches production. */
const dec = (value: string) => new Prisma.Decimal(value);

describe('ExamResultService', () => {
  let prisma: any;
  let service: ExamResultService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new ExamResultService(prisma);
  });

  describe('computeForEnrollment', () => {
    beforeEach(() => {
      prisma.exam.findFirst.mockResolvedValue({
        id: 'ex1',
        academicYearId: 'ay1',
        gradingScale: {
          items: [
            { minPercentage: dec('80'), maxPercentage: dec('100'), letterGrade: 'A', gradePoint: dec('3.6') },
            { minPercentage: dec('60'), maxPercentage: dec('79.99'), letterGrade: 'B', gradePoint: dec('3.2') },
            { minPercentage: dec('0'), maxPercentage: dec('59.99'), letterGrade: 'C', gradePoint: dec('2.8') },
          ],
        },
      });
      prisma.studentEnrollment.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.studentDailyAttendance.findMany.mockResolvedValue([]);
      prisma.examSchedule.findMany.mockResolvedValue([
        {
          id: 'sch1',
          theoryFullMarks: dec('100'),
          internalFullMarks: dec('40'),
          gradeSubject: {
            id: 'gs1',
            subjectId: 'sub1',
            creditHours: 4,
            theoryFullMarks: dec('100'),
            internalFullMarks: dec('40'),
            subject: { nameEn: 'Mathematics' },
          },
          marks: [
            {
              isTheoryAbsent: false,
              isInternalAbsent: false,
              theoryMarksObtained: dec('80'),
              internalMarksObtained: dec('36'),
            },
          ],
        },
      ]);
    });

    it('computes the total marks', async () => {
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      expect(result.totalMarksObtained.toFixed(2)).toBe('116.00');
    });

    it('computes the percentage against the full marks', async () => {
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      // 116 / 140
      expect(result.percentage.toFixed(2)).toBe('82.86');
    });

    it('derives the letter grade from the grading scale', async () => {
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      expect(result.finalGrade).toBe('A');
      expect(result.subjects[0].letterGrade).toBe('A');
    });

    it('computes a credit-weighted GPA', async () => {
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      expect(result.gpa!.toFixed(2)).toBe('3.60');
    });

    it('treats an absent subject as zero, not as a missing mark', async () => {
      prisma.examSchedule.findMany.mockResolvedValue([
        {
          id: 'sch1',
          theoryFullMarks: dec('100'),
          internalFullMarks: dec('40'),
          gradeSubject: {
            id: 'gs1',
            subjectId: 'sub1',
            creditHours: 4,
            subject: { nameEn: 'Mathematics' },
          },
          marks: [{ isTheoryAbsent: true, isInternalAbsent: true }],
        },
      ]);
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      expect(result.totalMarksObtained.toFixed(2)).toBe('0.00');
      expect(result.percentage.toFixed(2)).toBe('0.00');
      expect(result.subjects[0].absent).toBe(true);
    });

    it('counts the attendance days', async () => {
      prisma.studentDailyAttendance.findMany.mockResolvedValue([
        { status: 'PRESENT' },
        { status: 'PRESENT' },
        { status: 'ABSENT' },
        { status: 'LATE' },
      ]);
      const result = await service.computeForEnrollment('t1', 'ex1', 'e1');
      expect(result.totalAttendanceDays).toBe(4);
      expect(result.presentDays).toBe(3);
    });
  });
});
