#!/usr/bin/env python3
"""Find schema columns that no DTO exposes.

A column that exists in the database but is not in the request DTO cannot be
set through the API: the global validation pipe runs with
`forbidNonWhitelisted`, so the client is told the property "should not
exist".

That is exactly how `ClassFeeStructure.fiscalYearId` and
`GradeLevel.gradeNumber` were silently unreachable.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / "prisma" / "schema.prisma"

# The enum names in the schema, filled in by main().
KNOWN_ENUMS: set[str] = set()

# The models that have a request DTO, and the DTO that fronts them.
MODEL_TO_DTO = {
    "AcademicYear": "academics/dto/academic-year.dto.ts",
    "Stream": "academics/dto/stream.dto.ts",
    "GradeLevel": "academics/dto/grade-level.dto.ts",
    "Section": "academics/dto/section.dto.ts",
    "StaffProfile": "academics/dto/staff-profile.dto.ts",
    "Subject": "academics/dto/subject.dto.ts",
    "GradeSubject": "academics/dto/grade-subject.dto.ts",
    "AcademicCalendarEvent": "academics/dto/academic-calendar-event.dto.ts",
    "Student": "students/dto/student.dto.ts",
    "Address": "students/dto/address.dto.ts",
    "Guardian": "students/dto/guardian.dto.ts",
    "StudentGuardian": "students/dto/student-guardian.dto.ts",
    "StudentEnrollment": "enrollments/dto/enrollment.dto.ts",
    "Exam": "exams/dto/exam.dto.ts",
    "ExamSchedule": "exams/dto/exam-schedule.dto.ts",
    "ExamMark": "exams/dto/exam-mark.dto.ts",
    "StudentExamSummary": "exams/dto/student-exam-summary.dto.ts",
    "GradingScale": "examinations/dto/grading-scale.dto.ts",
    "GradingScaleItem": "examinations/dto/grading-scale.dto.ts",
    "FiscalYear": "fees/dto/fiscal-year.dto.ts",
    "FeeHead": "fees/dto/fee-head.dto.ts",
    "ClassFeeStructure": "fees/dto/class-fee-structure.dto.ts",
    "ScholarshipScheme": "fees/dto/scholarship-scheme.dto.ts",
    "StudentScholarship": "fees/dto/student-scholarship.dto.ts",
    "FeeInvoice": "fee-billing/dto/fee-invoice.dto.ts",
    "FeeInvoiceItem": "fee-billing/dto/fee-invoice-item.dto.ts",
    "FeePayment": "fee-billing/dto/fee-payment.dto.ts",
    "CreditNote": "fee-billing/dto/credit-note.dto.ts",
    "TeacherSubjectAllocation": "hr/dto/teacher-subject-allocation.dto.ts",
    "PayrollRun": "hr/dto/payroll-run.dto.ts",
    "SalarySlip": "hr/dto/salary-slip.dto.ts",
    "TransportVehicle": "transport/dto/vehicle.dto.ts",
    "TransportRoute": "transport/dto/route.dto.ts",
    "TransportStop": "transport/dto/stop.dto.ts",
    "StudentTransport": "transport/dto/student-transport.dto.ts",
    "Hostel": "hostel/dto/hostel.dto.ts",
    "HostelRoom": "hostel/dto/hostel.dto.ts",
    "HostelAllocation": "hostel/dto/hostel.dto.ts",
    "LibraryBook": "library/dto/library.dto.ts",
    "BookIssue": "library/dto/library.dto.ts",
    "TransferCertificate": "transfer-certificates/dto/transfer-certificate.dto.ts",
    "StudentDailyAttendance": "attendance/dto/attendance.dto.ts",
    "TimetableSlot": "timetable/dto/timetable.dto.ts",
}

# Columns that are never client-settable.
SERVER_OWNED = {
    "id", "tenantId", "createdAt", "updatedAt", "deletedAt",
    "enteredByUserId", "markedByUserId", "collectedByUserId", "approvedByUserId",
    "invitationToken", "invitationExpiresAt", "invitationAcceptedAt",
    "passwordHash", "refreshTokenHash", "refreshTokenExpiresAt",
    "failedLoginAttempts", "lockedUntil", "lastLoginAt", "lastLoginIp",
    "passwordChangedAt", "mustChangePassword", "twoFactorEnabled",
    "twoFactorSecret", "emailVerifiedAt", "phoneVerifiedAt",
    "isPublished", "isLocked", "printCount", "isSyncedToIrd",
    "availableCopies", "totalCopies", "netPayable", "netPayableAmount",
    "paidAmount", "balanceDue", "status", "tcNumber", "receiptNumber",
    "invoiceNumber", "appliedBsMonths",
    # Derived by the engines, never accepted from the client.
    "theoryGrade", "theoryGp", "internalGrade", "internalGp",
    "finalSubjectGrade", "finalSubjectGp",
    "totalMarksObtained", "percentage", "gpa", "finalGrade",
    "rankInSection", "rankInGrade", "totalAttendanceDays", "presentDays",
    "netAmount", "grossSalary",
    # Taken from the route or inherited from the parent record.
    "gradingScaleId", "theoryCreditHours", "internalCreditHours",
    "sectionId", "enrollmentId", "dateAd", "dateBs",
}


# A schema field declaration: name, then a type.
SCHEMA_FIELD = re.compile(r"^\s+([A-Za-z_][A-Za-z0-9_]*)\s+([A-Za-z_][A-Za-z0-9_]*)(\??|\[\])?")

# A DTO property: the *last* "name:" on the line. Decorators are skipped
# by taking the last match, which also copes with decorators whose
# arguments contain colons.
DTO_FIELD = re.compile(r"([A-Za-z_][A-Za-z0-9_]*)\s*[!?]?\s*:")

# Prisma's scalar types and the generated enums are not relations.
SCALARS = {
    "String", "Int", "Float", "Boolean", "DateTime", "Json", "Decimal", "BigInt",
}


def model_columns(schema: str, model: str) -> list[str]:
    """The scalar columns of a model. Relation fields are excluded."""
    match = re.search(rf"^model {model} \{{(.*?)^\}}", schema, flags=re.M | re.S)
    if not match:
        return []
    body = match.group(1)
    columns = []
    for line in body.split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("//") or stripped.startswith("@"):
            continue
        if stripped.startswith("@@"):
            continue
        field = SCHEMA_FIELD.match(line)
        if not field:
            continue
        name, type_name = field.group(1), field.group(2)
        if type_name in SCALARS:
            columns.append(name)
            continue
        # Anything else is either a relation or an enum. A relation field is
        # followed by an array or by the model name; an enum is a scalar the
        # client may also set, so it is kept.
        if field.group(3) == "[]":
            continue
        if type_name in KNOWN_ENUMS:
            columns.append(name)
    return columns


def dto_fields(dto_path: Path) -> set[str]:
    """The property names declared by a DTO."""
    if not dto_path.exists():
        return set()
    fields: set[str] = set()
    for line in dto_path.read_text().split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("//") or stripped.startswith("*"):
            continue
        matches = DTO_FIELD.findall(line)
        if matches:
            fields.add(matches[-1])
    return fields


def known_enums(schema: str) -> set[str]:
    return set(re.findall(r"^enum ([A-Za-z_][A-Za-z0-9_]*)", schema, flags=re.M))


def main() -> int:
    schema = SCHEMA.read_text()
    global KNOWN_ENUMS
    KNOWN_ENUMS = known_enums(schema)
    findings: list[tuple[str, str, str]] = []

    for model, dto_rel in sorted(MODEL_TO_DTO.items()):
        columns = model_columns(schema, model)
        if not columns:
            continue
        fields = dto_fields(ROOT / "src" / dto_rel)
        if not fields:
            continue
        for column in columns:
            if column in fields or column in SERVER_OWNED:
                continue
            findings.append((model, column, dto_rel))

    if not findings:
        print("Every client-settable schema column is exposed by its DTO.")
        return 0

    print(
        f"{len(findings)} schema columns are not exposed by their DTO, so they "
        "cannot be set through the API:"
    )
    print()
    for model, column, dto in findings:
        print(f"  {model}.{column}   ({dto})")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
