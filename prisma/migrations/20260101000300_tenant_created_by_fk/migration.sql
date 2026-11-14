-- Referential integrity for the platform user that onboarded a school.
--
-- `Tenant.createdByPlatformUserId` had no foreign key, so a platform user
-- could be deleted and the tenant would silently keep a dangling id.
ALTER TABLE "Tenant"
  ADD CONSTRAINT "Tenant_createdByPlatformUserId_fkey"
  FOREIGN KEY ("createdByPlatformUserId") REFERENCES "PlatformUser"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
