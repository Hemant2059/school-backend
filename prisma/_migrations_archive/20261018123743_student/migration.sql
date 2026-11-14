-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "CasteEthnicity" AS ENUM ('DALIT', 'JANAJATI', 'BRAHMIN_CHHETRI', 'MADHESI', 'MUSLIM', 'OTHERS');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('NONE', 'PHYSICAL', 'MENTAL', 'DEAF', 'BLIND', 'LOW_VISION', 'DEAF_BLIND', 'SPEECH', 'INTELLECTUAL', 'AUTISM', 'MULTIPLE');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "admissionNo" TEXT NOT NULL,
    "iemisStudentId" VARCHAR(20),
    "nebRegistrationNo" TEXT,
    "symbolNo" TEXT,
    "firstNameEn" TEXT NOT NULL,
    "middleNameEn" TEXT,
    "lastNameEn" TEXT NOT NULL,
    "fullNameNp" TEXT NOT NULL,
    "dobAd" TIMESTAMP(3) NOT NULL,
    "dobBs" VARCHAR(10) NOT NULL,
    "gender" "Gender" NOT NULL,
    "casteEthnicity" "CasteEthnicity" NOT NULL,
    "disabilityType" "DisabilityType" NOT NULL DEFAULT 'NONE',
    "motherTongue" TEXT,
    "bloodGroup" TEXT,
    "birthCertificateNo" TEXT,
    "nationalIdNin" TEXT,
    "permanentAddress" JSONB,
    "temporaryAddress" JSONB,
    "hadEcdExperience" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Student_tenantId_idx" ON "Student"("tenantId");

-- CreateIndex
CREATE INDEX "Student_userId_idx" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Student_deletedAt_idx" ON "Student"("deletedAt");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
