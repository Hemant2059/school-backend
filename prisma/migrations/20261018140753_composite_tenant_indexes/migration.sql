-- DropIndex
DROP INDEX "ExamMark_enrollmentId_idx";

-- DropIndex
DROP INDEX "FeeInvoice_deletedAt_idx";

-- DropIndex
DROP INDEX "FeeInvoice_enrollmentId_idx";

-- DropIndex
DROP INDEX "StudentDailyAttendance_deletedAt_idx";

-- DropIndex
DROP INDEX "StudentDailyAttendance_sectionId_idx";

-- DropIndex
DROP INDEX "StudentEnrollment_academicYearId_idx";

-- DropIndex
DROP INDEX "StudentEnrollment_deletedAt_idx";

-- DropIndex
DROP INDEX "StudentEnrollment_gradeLevelId_idx";

-- DropIndex
DROP INDEX "StudentEnrollment_sectionId_idx";

-- DropIndex
DROP INDEX "StudentEnrollment_studentId_idx";

-- CreateIndex
CREATE INDEX "ExamMark_tenantId_enrollmentId_idx" ON "ExamMark"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_enrollmentId_idx" ON "FeeInvoice"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_deletedAt_idx" ON "FeeInvoice"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "StudentDailyAttendance_tenantId_sectionId_idx" ON "StudentDailyAttendance"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "StudentDailyAttendance_tenantId_deletedAt_idx" ON "StudentDailyAttendance"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_studentId_idx" ON "StudentEnrollment"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_academicYearId_idx" ON "StudentEnrollment"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_gradeLevelId_idx" ON "StudentEnrollment"("tenantId", "gradeLevelId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_sectionId_idx" ON "StudentEnrollment"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_deletedAt_idx" ON "StudentEnrollment"("tenantId", "deletedAt");
