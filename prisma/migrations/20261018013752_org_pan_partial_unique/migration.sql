DROP INDEX IF EXISTS "Organization_panVatNumber_key";
CREATE UNIQUE INDEX "Organization_panVatNumber_active_key" ON "Organization"("panVatNumber") WHERE "deletedAt" IS NULL;
