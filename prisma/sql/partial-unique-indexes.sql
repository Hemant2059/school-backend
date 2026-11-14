-- Soft-delete aware unique constraints.
--
-- Prisma's schema language cannot express partial (WHERE) unique indexes, so
-- they live here as raw SQL. This is the established convention for this
-- project: a record that has been soft-deleted must not block a new record
-- with the same natural key from being created.
--
-- Every index below has a matching non-unique index in schema.prisma so that
-- Prisma still knows how to query the column.

CREATE UNIQUE INDEX "Organization_panVatNumber_active_key" ON "Organization"("panVatNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "AcademicYear_tenantId_name_active_key" ON "AcademicYear"("tenantId", "name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Stream_tenantId_code_active_key" ON "Stream"("tenantId", "code") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Role_tenantId_name_active_key" ON "Role"("tenantId", "name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "PlatformRole_name_active_key" ON "PlatformRole"("name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Student_tenantId_admissionNo_active_key" ON "Student"("tenantId", "admissionNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "StudentEnrollment_tenantId_studentId_academicYearId_active_key" ON "StudentEnrollment"("tenantId", "studentId", "academicYearId") WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Subject_tenantId_code_active_key" ON "Subject"("tenantId", "code") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "GradeSubject_tenantId_gradeLevelId_subjectId_active_key" ON "GradeSubject"("tenantId", "gradeLevelId", "subjectId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Section_tenantId_gradeLevelId_academicYearId_nameEn_active_key" ON "Section"("tenantId", "gradeLevelId", "academicYearId", "nameEn") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "StudentEnrollment_tenantId_sectionId_rollNo_active_key" ON "StudentEnrollment"("tenantId", "sectionId", "rollNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TransferCertificate_tenantId_tcNumber_active_key" ON "TransferCertificate"("tenantId", "tcNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeeHead_tenantId_nameEn_active_key" ON "FeeHead"("tenantId", "nameEn") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "ClassFeeStructure_academicYearId_gradeLevelId_feeHeadId_active_key" ON "ClassFeeStructure"("academicYearId", "gradeLevelId", "feeHeadId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeePayment_tenantId_receiptNumber_active_key" ON "FeePayment"("tenantId", "receiptNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeePayment_tenantId_gatewayTransactionId_active_key" ON "FeePayment"("tenantId", "gatewayTransactionId") WHERE "deletedAt" IS NULL AND "gatewayTransactionId" IS NOT NULL;
CREATE UNIQUE INDEX "PayrollRun_tenantId_fiscalYearId_bsYear_bsMonth_active_key" ON "PayrollRun"("tenantId", "fiscalYearId", "bsYear", "bsMonth") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "SalarySlip_payrollRunId_staffId_active_key" ON "SalarySlip"("payrollRunId", "staffId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TeacherSubjectAllocation_academicYearId_staffId_sectionId_subjectId_active_key" ON "TeacherSubjectAllocation"("academicYearId", "staffId", "sectionId", "subjectId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TimetableSlot_tenantId_staffId_dayOfWeek_periodNo_active_key" ON "TimetableSlot"("tenantId", "staffId", "dayOfWeek", "periodNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TransportVehicle_tenantId_vehicleNumber_active_key" ON "TransportVehicle"("tenantId", "vehicleNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "HostelRoom_tenantId_hostelId_roomNumber_active_key" ON "HostelRoom"("tenantId", "hostelId", "roomNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "LibraryBook_tenantId_isbn_active_key" ON "LibraryBook"("tenantId", "isbn") WHERE "deletedAt" IS NULL AND "isbn" IS NOT NULL;
CREATE UNIQUE INDEX "HostelAllocation_tenantId_enrollmentId_active_key" ON "HostelAllocation"("tenantId", "enrollmentId") WHERE "deletedAt" IS NULL AND "status" = 'ACTIVE';
CREATE UNIQUE INDEX "StudentTransport_tenantId_enrollmentId_active_key" ON "StudentTransport"("tenantId", "enrollmentId") WHERE "deletedAt" IS NULL AND "status" = 'ACTIVE';

-- A tenant may only have one "current" academic year and one "active"
-- fiscal year. Prisma cannot express these as partial unique indexes either.
CREATE UNIQUE INDEX "AcademicYear_tenantId_isCurrent_active_key" ON "AcademicYear"("tenantId") WHERE "isCurrent" = true AND "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FiscalYear_tenantId_isActive_active_key" ON "FiscalYear"("tenantId") WHERE "isActive" = true AND "deletedAt" IS NULL;

-- Business-rule guards that Prisma cannot express.
-- A grade band must not have min > max.
ALTER TABLE "GradingScaleItem"
  ADD CONSTRAINT "GradingScaleItem_min_max_check" CHECK ("minPercentage" <= "maxPercentage");
-- A student may not be enrolled in the same section twice with the same roll number.
ALTER TABLE "StudentEnrollment"
  ADD CONSTRAINT "StudentEnrollment_rollNo_check" CHECK ("rollNo" > 0);
-- Fee amounts may never be negative.
ALTER TABLE "FeeInvoiceItem"
  ADD CONSTRAINT "FeeInvoiceItem_amounts_check" CHECK ("grossAmount" >= 0 AND "discountAmount" >= 0 AND "netAmount" >= 0);
ALTER TABLE "FeePayment"
  ADD CONSTRAINT "FeePayment_amountPaid_check" CHECK ("amountPaid" >= 0);
-- Marks may never be negative.
ALTER TABLE "ExamMark"
  ADD CONSTRAINT "ExamMark_marks_check" CHECK (
    ("theoryMarksObtained" IS NULL OR "theoryMarksObtained" >= 0)
    AND ("internalMarksObtained" IS NULL OR "internalMarksObtained" >= 0)
  );
-- Book copies cannot exceed the total.
ALTER TABLE "LibraryBook"
  ADD CONSTRAINT "LibraryBook_copies_check" CHECK ("totalCopies" >= 0 AND "availableCopies" >= 0 AND "availableCopies" <= "totalCopies");
