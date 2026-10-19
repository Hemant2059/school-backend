-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('PERCENTAGE', 'GPA', 'LETTER', 'CGPA');

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "streamId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "iemisGradeCode" TEXT,
    "evaluationType" "EvaluationType" NOT NULL DEFAULT 'PERCENTAGE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "capacity" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stream_tenantId_idx" ON "Stream"("tenantId");

-- CreateIndex
CREATE INDEX "Stream_deletedAt_idx" ON "Stream"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_tenantId_code_key" ON "Stream"("tenantId", "code");

-- CreateIndex
CREATE INDEX "GradeLevel_tenantId_idx" ON "GradeLevel"("tenantId");

-- CreateIndex
CREATE INDEX "GradeLevel_streamId_idx" ON "GradeLevel"("streamId");

-- CreateIndex
CREATE INDEX "GradeLevel_deletedAt_idx" ON "GradeLevel"("deletedAt");

-- CreateIndex
CREATE INDEX "Section_tenantId_idx" ON "Section"("tenantId");

-- CreateIndex
CREATE INDEX "Section_gradeLevelId_idx" ON "Section"("gradeLevelId");

-- CreateIndex
CREATE INDEX "Section_deletedAt_idx" ON "Section"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Section_tenantId_gradeLevelId_nameEn_key" ON "Section"("tenantId", "gradeLevelId", "nameEn");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
