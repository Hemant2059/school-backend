-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('DRAFT', 'APPROVED', 'DISBURSED');

-- CreateTable
CREATE TABLE "TeacherSubjectAllocation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TeacherSubjectAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRun" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "bsYear" SMALLINT NOT NULL,
    "bsMonth" SMALLINT NOT NULL,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PayrollRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalarySlip" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payrollRunId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "basicSalary" DECIMAL(12,2) NOT NULL,
    "gradeAllowance" DECIMAL(12,2) NOT NULL,
    "dearnessAllowance" DECIMAL(12,2) NOT NULL,
    "employerPfSsfContribution" DECIMAL(12,2) NOT NULL,
    "employeePfSsfDeduction" DECIMAL(12,2) NOT NULL,
    "citDeduction" DECIMAL(12,2) NOT NULL,
    "salaryAdvanceDeduction" DECIMAL(12,2) NOT NULL,
    "sstTax1Percent" DECIMAL(12,2) NOT NULL,
    "tdsIncomeTax" DECIMAL(12,2) NOT NULL,
    "netPayable" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SalarySlip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_tenantId_idx" ON "TeacherSubjectAllocation"("tenantId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_academicYearId_idx" ON "TeacherSubjectAllocation"("academicYearId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_staffId_idx" ON "TeacherSubjectAllocation"("staffId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_sectionId_idx" ON "TeacherSubjectAllocation"("sectionId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_subjectId_idx" ON "TeacherSubjectAllocation"("subjectId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_deletedAt_idx" ON "TeacherSubjectAllocation"("deletedAt");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_idx" ON "PayrollRun"("tenantId");

-- CreateIndex
CREATE INDEX "PayrollRun_fiscalYearId_idx" ON "PayrollRun"("fiscalYearId");

-- CreateIndex
CREATE INDEX "PayrollRun_deletedAt_idx" ON "PayrollRun"("deletedAt");

-- CreateIndex
CREATE INDEX "SalarySlip_tenantId_idx" ON "SalarySlip"("tenantId");

-- CreateIndex
CREATE INDEX "SalarySlip_payrollRunId_idx" ON "SalarySlip"("payrollRunId");

-- CreateIndex
CREATE INDEX "SalarySlip_staffId_idx" ON "SalarySlip"("staffId");

-- CreateIndex
CREATE INDEX "SalarySlip_deletedAt_idx" ON "SalarySlip"("deletedAt");

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "PayrollRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
