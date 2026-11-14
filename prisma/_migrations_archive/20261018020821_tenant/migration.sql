-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('COMMUNITY', 'INSTITUTIONAL_PRIVATE', 'GUTHI', 'COOPERATIVE', 'RELIGIOUS');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "iemisCode" VARCHAR(15),
    "schoolType" "SchoolType" NOT NULL,
    "provinceCode" TEXT NOT NULL,
    "provinceNe" TEXT NOT NULL,
    "provinceEn" TEXT,
    "districtCode" TEXT NOT NULL,
    "districtNe" TEXT NOT NULL,
    "districtEn" TEXT,
    "municipalityCode" TEXT NOT NULL,
    "municipalityNe" TEXT NOT NULL,
    "municipalityEn" TEXT,
    "wardNumber" INTEGER NOT NULL,
    "toleEn" TEXT,
    "toleNe" TEXT,
    "addressEn" TEXT,
    "addressNe" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "establishedDateAd" TIMESTAMP(3),
    "establishedDateBs" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'ONBOARDING',
    "createdByPlatformUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_iemisCode_key" ON "Tenant"("iemisCode");

-- CreateIndex
CREATE INDEX "Tenant_organizationId_idx" ON "Tenant"("organizationId");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "Tenant_schoolType_idx" ON "Tenant"("schoolType");

-- CreateIndex
CREATE INDEX "Tenant_provinceCode_districtCode_municipalityCode_idx" ON "Tenant"("provinceCode", "districtCode", "municipalityCode");

-- CreateIndex
CREATE INDEX "Tenant_deletedAt_idx" ON "Tenant"("deletedAt");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
