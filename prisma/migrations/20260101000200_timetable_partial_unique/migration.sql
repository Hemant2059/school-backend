-- The section/period uniqueness must be soft-delete aware.
--
-- The plain unique index meant that removing a lesson from a timetable
-- permanently blocked the period from ever being scheduled again, even
-- though the slot itself had been soft-deleted.
DROP INDEX IF EXISTS "TimetableSlot_tenantId_sectionId_dayOfWeek_periodNo_key";

CREATE UNIQUE INDEX IF NOT EXISTS "TimetableSlot_tenantId_sectionId_dayOfWeek_periodNo_active_key"
  ON "TimetableSlot"("tenantId", "sectionId", "dayOfWeek", "periodNo")
  WHERE "deletedAt" IS NULL;

-- The teacher cannot be in two places at once. This index was created by
-- the baseline migration.
CREATE UNIQUE INDEX IF NOT EXISTS "TimetableSlot_tenantId_staffId_dayOfWeek_periodNo_active_key"
  ON "TimetableSlot"("tenantId", "staffId", "dayOfWeek", "periodNo")
  WHERE "deletedAt" IS NULL;
