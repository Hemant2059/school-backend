-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('TRUST', 'FOUNDATION', 'COMPANY', 'NGO', 'GOVERNMENT', 'COOPERATIVE', 'SCHOOL_GROUP', 'OTHER');

-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactPersonEmail" TEXT,
ADD COLUMN     "contactPersonName" TEXT,
ADD COLUMN     "contactPersonPhone" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "establishedDate" TIMESTAMP(3),
ADD COLUMN     "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "isTaxExempt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "municipality" TEXT,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "nameNp" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "organizationType" "OrganizationType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "shortName" TEXT,
ADD COLUMN     "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
ADD COLUMN     "tole" TEXT,
ADD COLUMN     "wardNumber" INTEGER,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- CreateIndex
CREATE INDEX "Organization_province_district_idx" ON "Organization"("province", "district");
