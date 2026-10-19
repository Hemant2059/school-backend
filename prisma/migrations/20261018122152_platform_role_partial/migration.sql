DROP INDEX IF EXISTS "PlatformRole_name_key";
CREATE UNIQUE INDEX "PlatformRole_name_active_key" ON "PlatformRole"("name") WHERE "deletedAt" IS NULL;
