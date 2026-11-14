-- CreateEnum
CREATE TYPE "FeeFrequency" AS ENUM ('MONTHLY_BS', 'ONE_TIME', 'TERM_WISE', 'ANNUAL', 'AD_HOC');

-- CreateEnum
CREATE TYPE "IemisScholarshipType" AS ENUM ('DALIT', 'JANAJATI', 'MARTYR_CHILD', 'CONFLICT_VICTIM', 'POOR_TALENTED', 'DISABILITY', 'MUNICIPAL_QUOTA', 'SCHOOL_INTERNAL');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FLAT_AMOUNT');

-- CreateTable
CREATE TABLE "FiscalYear" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDateAd" TIMESTAMP(3) NOT NULL,
    "startDateBs" VARCHAR(10) NOT NULL,
    "endDateAd" TIMESTAMP(3) NOT NULL,
    "endDateBs" VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FiscalYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeHead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "frequency" "FeeFrequency" NOT NULL,
    "isTaxable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeHead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassFeeStructure" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "applicableBsMonths" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "fiscalYearId" TEXT,

    CONSTRAINT "ClassFeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipScheme" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iemisScholarshipType" "IemisScholarshipType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ScholarshipScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentScholarship" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "scholarshipSchemeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentScholarship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FiscalYear_tenantId_idx" ON "FiscalYear"("tenantId");

-- CreateIndex
CREATE INDEX "FiscalYear_deletedAt_idx" ON "FiscalYear"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeHead_tenantId_idx" ON "FeeHead"("tenantId");

-- CreateIndex
CREATE INDEX "FeeHead_deletedAt_idx" ON "FeeHead"("deletedAt");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_tenantId_idx" ON "ClassFeeStructure"("tenantId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_academicYearId_idx" ON "ClassFeeStructure"("academicYearId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_gradeLevelId_idx" ON "ClassFeeStructure"("gradeLevelId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_feeHeadId_idx" ON "ClassFeeStructure"("feeHeadId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_deletedAt_idx" ON "ClassFeeStructure"("deletedAt");

-- CreateIndex
CREATE INDEX "ScholarshipScheme_tenantId_idx" ON "ScholarshipScheme"("tenantId");

-- CreateIndex
CREATE INDEX "ScholarshipScheme_deletedAt_idx" ON "ScholarshipScheme"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentScholarship_tenantId_idx" ON "StudentScholarship"("tenantId");

-- CreateIndex
CREATE INDEX "StudentScholarship_enrollmentId_idx" ON "StudentScholarship"("enrollmentId");

-- AddForeignKey
ALTER TABLE "FiscalYear" ADD CONSTRAINT "FiscalYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeHead" ADD CONSTRAINT "FeeHead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipScheme" ADD CONSTRAINT "ScholarshipScheme_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_scholarshipSchemeId_fkey" FOREIGN KEY ("scholarshipSchemeId") REFERENCES "ScholarshipScheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
