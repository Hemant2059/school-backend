#!/usr/bin/env python3
"""Apply schema constraint/index changes to prisma/schema.prisma.

Each replacement is anchored on a unique, exact snippet and the script aborts
if any anchor is missing or ambiguous, so it can never silently corrupt the
schema.
"""
import sys
from pathlib import Path

SCHEMA = Path(__file__).resolve().parents[1] / "prisma" / "schema.prisma"

# (anchor, replacement, description)
EDITS: list[tuple[str, str, str]] = [
    # ---- Section: unique name per grade level + academic year -------------
    (
        """  @@index([tenantId])
  @@index([gradeLevelId])
  @@index([academicYearId])
  @@index([classTeacherId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([gradeLevelId])
  @@index([academicYearId])
  @@index([classTeacherId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, gradeLevelId, academicYearId, nameEn])
}""",
        "Section indexes",
    ),
    # ---- GradeLevel: numeric grade ordering -------------------------------
    (
        """  nameNe         String
  iemisGradeCode String?
  evaluationType EvaluationType @default(PERCENTAGE)
  sortOrder      Int            @default(0)""",
        """  nameNe         String
  iemisGradeCode String?
  /// Numeric grade (1-12) used for ordering and NEB reporting.
  gradeNumber    Int?
  evaluationType EvaluationType @default(PERCENTAGE)
  sortOrder      Int            @default(0)""",
        "GradeLevel.gradeNumber",
    ),
    (
        """  @@index([tenantId])
  @@index([streamId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([streamId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, gradeNumber])
}""",
        "GradeLevel indexes",
    ),
    # ---- Student ---------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([userId])
  @@index([deletedAt])
}

enum AddressEntityType {""",
        """  @@index([tenantId])
  @@index([userId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, admissionNo])
}

enum AddressEntityType {""",
        "Student indexes",
    ),
    # ---- StudentEnrollment -----------------------------------------------
    (
        """  @@index([tenantId, deletedAt])
}

model TransferCertificate {""",
        """  @@index([tenantId, deletedAt])
  @@index([tenantId, sectionId, rollNo])
}

model TransferCertificate {""",
        "StudentEnrollment rollNo index",
    ),
    # ---- TransferCertificate ---------------------------------------------
    (
        """  @@index([tenantId])
  @@index([studentId])
  @@index([deletedAt])
}

model GradingScale {""",
        """  @@index([tenantId])
  @@index([studentId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, tcNumber])
}

model GradingScale {""",
        "TransferCertificate indexes",
    ),
    # ---- GradingScaleItem: unique letter grade per scale -----------------
    (
        """  @@index([gradingScaleId])
}""",
        """  @@index([gradingScaleId])
  @@unique([gradingScaleId, letterGrade])
}""",
        "GradingScaleItem unique letter grade",
    ),
    # ---- Exam: exam type discriminator -----------------------------------
    (
        """enum ExamStatus {
  DRAFT
  PUBLISHED
  LOCKED
}

model Exam {""",
        """/// Nepal classifies exams as terminal (annual) or periodic (unit test,
/// quarterly, practical). The distinction drives weighting and reporting.
enum ExamType {
  TERMINAL
  PERIODIC
  UNIT
  PRACTICAL
  INTERNAL
}

model Exam {""",
        "ExamType enum (replaces dead ExamStatus)",
    ),
    (
        """  name          String
  termWeightage Decimal? @db.Decimal(5, 2)""",
        """  name          String
  examType      ExamType  @default(TERMINAL)
  termWeightage Decimal? @db.Decimal(5, 2)""",
        "Exam.examType column",
    ),
    (
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([deletedAt])
}

model ExamSchedule {""",
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
}

model ExamSchedule {""",
        "Exam indexes",
    ),
    (
        """  @@index([tenantId])
  @@index([examId])
  @@index([gradeSubjectId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([examId])
  @@index([gradeSubjectId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([examId, examDateAd])
}""",
        "ExamSchedule indexes",
    ),
    # ---- FeeHead ---------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([deletedAt])
}

model ClassFeeStructure {""",
        """  @@index([tenantId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, nameEn])
}

model ClassFeeStructure {""",
        "FeeHead indexes",
    ),
    # ---- ClassFeeStructure ------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([gradeLevelId])
  @@index([feeHeadId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([gradeLevelId])
  @@index([feeHeadId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([academicYearId, gradeLevelId, feeHeadId])
}""",
        "ClassFeeStructure indexes",
    ),
    # ---- StudentScholarship ------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([enrollmentId])
}

enum FeeInvoiceStatus {""",
        """  @@index([tenantId])
  @@index([enrollmentId])
  @@index([enrollmentId, feeHeadId])
}

enum FeeInvoiceStatus {""",
        "StudentScholarship index",
    ),
    # ---- FeeInvoice --------------------------------------------------------
    (
        """  @@unique([tenantId, fiscalYearId, invoiceNumber])
  @@index([tenantId])
  @@index([tenantId, enrollmentId])
  @@index([tenantId, deletedAt])""",
        """  @@unique([tenantId, fiscalYearId, invoiceNumber])
  @@index([tenantId])
  @@index([tenantId, enrollmentId])
  @@index([tenantId, deletedAt])
  @@index([tenantId, status])
  @@index([tenantId, fiscalYearId, enrollmentId])""",
        "FeeInvoice indexes",
    ),
    # ---- FeeInvoiceItem ----------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([invoiceId])
}

model FeePayment {""",
        """  @@index([tenantId])
  @@index([invoiceId])
  @@index([tenantId, invoiceId])
}

model FeePayment {""",
        "FeeInvoiceItem indexes",
    ),
    # ---- FeePayment --------------------------------------------------------
    (
        """enum FeePaymentMethod {
  CASH
  ESEWA
  KHALTI
  FONEPAY_QR
  CONNECT_IPS
  BANK_VOUCHER
  CHEQUE
}""",
        """enum FeePaymentMethod {
  CASH
  ESEWA
  KHALTI
  FONEPAY_QR
  CONNECT_IPS
  BANK_VOUCHER
  CHEQUE
}

/// Lifecycle of a fee receipt.
enum FeePaymentStatus {
  PENDING
  SUCCESS
  FAILED
  /// A receipt that was voided out (e.g. an entry mistake). The amount is
  /// added back to the invoice balance but the row is retained for audit.
  REVERSED
}""",
        "FeePaymentStatus enum",
    ),
    (
        """  amountPaid             Decimal          @db.Decimal(10, 2)
  paymentMethod          FeePaymentMethod""",
        """  amountPaid             Decimal          @db.Decimal(12, 2)
  paymentMethod          FeePaymentMethod
  status                 FeePaymentStatus  @default(SUCCESS)""",
        "FeePayment status column + precision alignment",
    ),
    (
        """  @@index([tenantId])
  @@index([fiscalYearId])
  @@index([enrollmentId])
  @@index([invoiceId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([fiscalYearId])
  @@index([enrollmentId])
  @@index([invoiceId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, status])
}""",
        "FeePayment indexes",
    ),
    # ---- CreditNote --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([invoiceId])
}

enum PayrollRunStatus {""",
        """  @@index([tenantId])
  @@index([invoiceId])
  @@index([tenantId, creditNoteNumber])
}

enum PayrollRunStatus {""",
        "CreditNote index",
    ),
    # ---- PayrollRun --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([fiscalYearId])
  @@index([deletedAt])
}

model SalarySlip {""",
        """  @@index([tenantId])
  @@index([fiscalYearId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, fiscalYearId, bsYear, bsMonth])
}

model SalarySlip {""",
        "PayrollRun indexes",
    ),
    # ---- SalarySlip --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([payrollRunId])
  @@index([staffId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([payrollRunId])
  @@index([staffId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([payrollRunId, staffId])
}""",
        "SalarySlip indexes",
    ),
    # ---- TeacherSubjectAllocation -----------------------------------------
    (
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([staffId])
  @@index([sectionId])
  @@index([subjectId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([academicYearId])
  @@index([staffId])
  @@index([sectionId])
  @@index([subjectId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([academicYearId, staffId, sectionId, subjectId])
}""",
        "TeacherSubjectAllocation indexes",
    ),
    # ---- TimetableSlot ------------------------------------------------------
    (
        """  @@unique([tenantId, sectionId, dayOfWeek, periodNo])
  @@index([tenantId])
  @@index([sectionId])
  @@index([staffId])
  @@index([deletedAt])""",
        """  @@unique([tenantId, sectionId, dayOfWeek, periodNo])
  @@index([tenantId])
  @@index([sectionId])
  @@index([staffId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, staffId, dayOfWeek, periodNo])""",
        "TimetableSlot indexes",
    ),
    # ---- TransportVehicle ---------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([deletedAt])
}

model TransportRoute {""",
        """  @@index([tenantId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, vehicleNumber])
}

model TransportRoute {""",
        "TransportVehicle indexes",
    ),
    # ---- TransportStop ------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([routeId])
  @@index([deletedAt])
}

model StudentTransport {""",
        """  @@index([tenantId])
  @@index([routeId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([routeId, sequence])
}

model StudentTransport {""",
        "TransportStop indexes",
    ),
    # ---- StudentTransport ---------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([enrollmentId])
  @@index([deletedAt])
}

enum BookIssueStatus {""",
        """  @@index([tenantId])
  @@index([enrollmentId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
}

enum BookIssueStatus {""",
        "StudentTransport indexes",
    ),
    # ---- LibraryBook --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([deletedAt])
}

model BookIssue {""",
        """  @@index([tenantId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, isbn])
}

model BookIssue {""",
        "LibraryBook indexes",
    ),
    # ---- HostelRoom ---------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([hostelId])
  @@index([deletedAt])
}

model HostelAllocation {""",
        """  @@index([tenantId])
  @@index([hostelId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, hostelId, roomNumber])
}

model HostelAllocation {""",
        "HostelRoom indexes",
    ),
    # ---- HostelAllocation ---------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([hostelId])
  @@index([roomId])
  @@index([enrollmentId])
  @@index([deletedAt])
}""",
        """  @@index([tenantId])
  @@index([hostelId])
  @@index([roomId])
  @@index([enrollmentId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
}""",
        "HostelAllocation indexes",
    ),
    # ---- Notification --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([recipientType, recipientId])
  @@index([isRead])
  @@index([deletedAt])""",
        """  @@index([tenantId])
  @@index([recipientType, recipientId])
  @@index([isRead])
  @@index([deletedAt])
  @@index([recipientType, recipientId, isRead])
  @@index([tenantId, deletedAt])""",
        "Notification indexes",
    ),
    # ---- StaffProfile --------------------------------------------------------
    (
        """  @@index([tenantId])
  @@index([deletedAt])
}

enum StaffCategory {""",
        """  @@index([tenantId])
  @@index([deletedAt])
  @@index([tenantId, deletedAt])
  @@index([tenantId, employeeCode])
}

enum StaffCategory {""",
        "StaffProfile indexes",
    ),
]


def main() -> int:
    text = SCHEMA.read_text()
    applied = 0
    for anchor, replacement, description in EDITS:
        count = text.count(anchor)
        if count != 1:
            print(f"ABORT: anchor for '{description}' matched {count} times", file=sys.stderr)
            return 1
        text = text.replace(anchor, replacement)
        applied += 1
    SCHEMA.write_text(text)
    print(f"applied {applied}/{len(EDITS)} schema edits")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
