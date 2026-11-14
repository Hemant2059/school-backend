DROP INDEX IF EXISTS "Stream_tenantId_code_key";
CREATE UNIQUE INDEX "Stream_tenantId_code_active_key" ON "Stream"("tenantId", "code") WHERE "deletedAt" IS NULL;
