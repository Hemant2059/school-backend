-- AlterTable
ALTER TABLE "AcademicYear" ALTER COLUMN "startDateBs" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "endDateBs" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "establishedDateBs" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "establishedDateBs" SET DATA TYPE VARCHAR(10);
