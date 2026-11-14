DROP INDEX IF EXISTS "StudentEnrollment_tenantId_studentId_academicYearId_key";
CREATE UNIQUE INDEX "StudentEnrollment_tenantId_studentId_academicYearId_active_key" ON "StudentEnrollment"("tenantId", "studentId", "academicYearId") WHERE "deletedAt" IS NULL;
