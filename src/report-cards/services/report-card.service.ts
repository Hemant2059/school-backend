import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../../prisma.service.js';

/**
 * Generates school report cards (marksheets) as PDFs.
 *
 * Each PDF is built in-memory and streamed directly to the response, so
 * there is no file system dependency.
 */
@Injectable()
export class ReportCardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a single-student report card PDF for one exam.
   */
  async generateStudentReportCard(
    tenantId: string,
    enrollmentId: string,
    examId?: string,
  ): Promise<Buffer> {
    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: enrollmentId, tenantId, deletedAt: null },
      include: {
        student: true,
        gradeLevel: true,
        section: true,
        academicYear: true,
      },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    // Resolve the exam (latest if not specified).
    let resolvedExamId = examId;
    if (!resolvedExamId) {
      const latestExam = await this.prisma.exam.findFirst({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      if (!latestExam) throw new NotFoundException('No exams found');
      resolvedExamId = latestExam.id;
    }

    const exam = await this.prisma.exam.findFirst({
      where: { id: resolvedExamId, tenantId, deletedAt: null },
      include: { gradingScale: { include: { items: true } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const schedules = await this.prisma.examSchedule.findMany({
      where: { tenantId, examId: resolvedExamId, deletedAt: null },
      include: {
        gradeSubject: { include: { subject: true } },
        marks: { where: { enrollmentId }, take: 1 },
      },
    });

    const summary = await this.prisma.studentExamSummary.findFirst({
      where: { tenantId, examId: resolvedExamId, enrollmentId },
    });

    return this.buildPdf((doc) => {
      // Header
      doc.fontSize(18).text(`${exam.name} — Report Card`, { align: 'center' });
      doc.moveDown(0.5);
      const parts = [
        `Student: ${enrollment.student.firstNameNe} ${enrollment.student.lastNameNe}`,
        `Admission No: ${enrollment.student.admissionNo}`,
        `Grade: ${enrollment.gradeLevel.nameNe}   Section: ${enrollment.section.nameNe}`,
        `Academic Year: ${enrollment.academicYear.name}`,
        `Exam: ${exam.name}`,
      ];
      for (const part of parts) {
        doc.fontSize(10).text(part, { align: 'left' });
      }
      doc.moveDown(1);

      // Table of subject marks
      const tableTop = doc.y;
      const colSubject = 40;
      const colTheory = 220;
      const colInternal = 300;
      const colTotal = 380;
      const colGrade = 440;

      doc.fontSize(11).text('Subject', colSubject, tableTop, { width: 180 });
      doc.text('Theory', colTheory, tableTop, { width: 80 });
      doc.text('Internal', colInternal, tableTop, { width: 80 });
      doc.text('Total', colTotal, tableTop, { width: 60 });
      doc.text('Grade', colGrade, tableTop, { width: 60 });
      doc
        .moveTo(colSubject, tableTop + 16)
        .lineTo(550, tableTop + 16)
        .stroke();
      doc.moveDown(0.5);

      let rowY = tableTop + 24;
      for (const schedule of schedules) {
        const subject = schedule.gradeSubject.subject;
        const mark = schedule.marks[0];

        const isAbsTheory = mark?.isTheoryAbsent ?? false;
        const isAbsInternal = mark?.isInternalAbsent ?? false;
        const theory = isAbsTheory
          ? 'Ab'
          : (mark?.theoryMarksObtained?.toString() ?? '-');
        const internal = isAbsInternal
          ? 'Ab'
          : (mark?.internalMarksObtained?.toString() ?? '-');
        const total =
          isAbsTheory && isAbsInternal
            ? 'Ab'
            : mark
              ? Number(mark.theoryMarksObtained ?? 0) +
                Number(mark.internalMarksObtained ?? 0)
              : '-';
        const grade = mark?.finalSubjectGrade ?? '-';

        doc
          .fontSize(9)
          .text(subject.nameNe, colSubject, rowY, { width: 180 })
          .text(theory, colTheory, rowY, { width: 80 })
          .text(internal, colInternal, rowY, { width: 80 })
          .text(String(total), colTotal, rowY, { width: 60 })
          .text(grade, colGrade, rowY, { width: 60 });
        rowY += 18;
      }

      // Summary row
      doc.moveDown(1);
      const sumY = doc.y + 4;
      doc
        .moveTo(colSubject, sumY - 2)
        .lineTo(550, sumY - 2)
        .stroke();
      doc
        .fontSize(11)
        .text(
          `Total Marks: ${String(summary?.totalMarksObtained ?? '-')}`,
          colSubject,
          sumY + 6,
        );
      doc.text(
        `Percentage: ${String(summary?.percentage ?? '-')}%`,
        colSubject + 180,
        sumY + 6,
      );
      doc.text(
        `GPA: ${String(summary?.gpa ?? '-')}`,
        colSubject + 350,
        sumY + 6,
      );
      doc.text(
        `Final Grade: ${summary?.finalGrade ?? '-'}`,
        colSubject + 450,
        sumY + 6,
      );
      doc.text(
        `Rank in Section: ${summary?.rankInSection ?? '-'}`,
        colSubject,
        sumY + 24,
      );
      doc.text(
        `Attendance: ${summary?.presentDays ?? '-'}/${summary?.totalAttendanceDays ?? '-'}`,
        colSubject + 180,
        sumY + 24,
      );
    });
  }

  /**
   * Generates a class marksheet PDF for one section for one exam.
   */
  async generateClassMarksheet(
    tenantId: string,
    sectionId: string,
    examId?: string,
  ): Promise<Buffer> {
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId, tenantId, deletedAt: null },
      include: { gradeLevel: true, academicYear: true },
    });
    if (!section) throw new NotFoundException('Section not found');

    let resolvedExamId = examId;
    if (!resolvedExamId) {
      const latestExam = await this.prisma.exam.findFirst({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      });
      if (!latestExam) throw new NotFoundException('No exams found');
      resolvedExamId = latestExam.id;
    }

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        sectionId,
        deletedAt: null,
      },
      include: {
        student: true,
        examSummaries: { where: { examId: resolvedExamId } },
      },
      orderBy: { rollNo: 'asc' },
    });

    return this.buildPdf((doc) => {
      doc
        .fontSize(18)
        .text(
          `Marksheet — ${section.academicYear?.name ?? ''}${section.gradeLevel.nameEn} ${section.nameEn}`,
          { align: 'center' },
        );
      doc.moveDown(1);

      const tableTop = doc.y;
      doc
        .fontSize(10)
        .text('Roll', 40, tableTop, { width: 40 })
        .text('Student', 90, tableTop, { width: 150 })
        .text('Total', 250, tableTop, { width: 60 })
        .text('Percentage', 320, tableTop, { width: 80 })
        .text('Grade', 410, tableTop, { width: 50 })
        .text('Rank', 470, tableTop, { width: 50 });
      doc
        .moveTo(40, tableTop + 14)
        .lineTo(550, tableTop + 14)
        .stroke();
      doc.moveDown(0.5);

      let rowY = tableTop + 20;
      for (const enrollment of enrollments) {
        const summary = enrollment.examSummaries[0];
        doc
          .fontSize(9)
          .text(String(enrollment.rollNo), 40, rowY, { width: 40 })
          .text(
            `${enrollment.student.firstNameNe} ${enrollment.student.lastNameNe}`,
            90,
            rowY,
            {
              width: 150,
            },
          )
          .text(String(summary?.totalMarksObtained ?? '-'), 250, rowY, {
            width: 60,
          })
          .text(String(summary?.percentage ?? '-'), 320, rowY, { width: 80 })
          .text(summary?.finalGrade ?? '-', 410, rowY, { width: 50 })
          .text(String(summary?.rankInSection ?? '-'), 470, rowY, {
            width: 50,
          });
        rowY += 18;
        if (rowY > 730) {
          doc.addPage();
          rowY = 50;
        }
      }
    });
  }

  // ---------------------------------------------------------------------
  // PDF builder
  // ---------------------------------------------------------------------

  private buildPdf(
    builder: (doc: PDFKit.PDFDocument) => void,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('error', reject);
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      try {
        builder(doc);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
