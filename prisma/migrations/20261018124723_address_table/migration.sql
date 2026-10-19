-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('PERMANENT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "AddressFormat" AS ENUM ('PROVINCIAL', 'ZONAL');

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "permanentAddress",
DROP COLUMN "temporaryAddress";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "format" "AddressFormat" NOT NULL,
    "provinceCode" TEXT,
    "provinceNe" TEXT,
    "provinceEn" TEXT,
    "districtCode" TEXT,
    "districtNe" TEXT,
    "districtEn" TEXT,
    "municipalityCode" TEXT,
    "municipalityNe" TEXT,
    "municipalityEn" TEXT,
    "ward" INTEGER,
    "toleNe" TEXT,
    "toleEn" TEXT,
    "zoneCode" TEXT,
    "zoneNe" TEXT,
    "zoneEn" TEXT,
    "vdcCode" TEXT,
    "vdcNe" TEXT,
    "vdcEn" TEXT,
    "village" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Address_tenantId_idx" ON "Address"("tenantId");

-- CreateIndex
CREATE INDEX "Address_studentId_idx" ON "Address"("studentId");

-- CreateIndex
CREATE INDEX "Address_type_idx" ON "Address"("type");

-- CreateIndex
CREATE INDEX "Address_deletedAt_idx" ON "Address"("deletedAt");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
