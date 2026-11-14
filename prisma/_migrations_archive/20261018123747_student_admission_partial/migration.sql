CREATE UNIQUE INDEX "Student_tenantId_admissionNo_active_key" ON "Student"("tenantId", "admissionNo") WHERE "deletedAt" IS NULL;
