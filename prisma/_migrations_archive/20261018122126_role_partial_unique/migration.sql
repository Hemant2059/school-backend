DROP INDEX IF EXISTS "Role_tenantId_name_key";
CREATE UNIQUE INDEX "Role_tenantId_name_active_key" ON "Role"("tenantId", "name") WHERE "deletedAt" IS NULL;
