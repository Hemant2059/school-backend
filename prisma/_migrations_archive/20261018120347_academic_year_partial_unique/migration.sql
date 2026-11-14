DROP INDEX IF EXISTS "AcademicYear_tenantId_name_key";
CREATE UNIQUE INDEX "AcademicYear_tenantId_name_active_key" ON "AcademicYear"("tenantId", "name") WHERE "deletedAt" IS NULL;
