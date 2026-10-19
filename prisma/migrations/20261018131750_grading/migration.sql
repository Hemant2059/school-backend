-- CreateTable
CREATE TABLE "GradingScale" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GradingScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingScaleItem" (
    "id" TEXT NOT NULL,
    "gradingScaleId" TEXT NOT NULL,
    "minPercentage" DECIMAL(5,2) NOT NULL,
    "maxPercentage" DECIMAL(5,2) NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "gradePoint" DECIMAL(3,2) NOT NULL,
    "descriptorEn" TEXT,
    "descriptorNp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingScaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradingScale_tenantId_idx" ON "GradingScale"("tenantId");

-- CreateIndex
CREATE INDEX "GradingScale_deletedAt_idx" ON "GradingScale"("deletedAt");

-- CreateIndex
CREATE INDEX "GradingScaleItem_gradingScaleId_idx" ON "GradingScaleItem"("gradingScaleId");

-- AddForeignKey
ALTER TABLE "GradingScale" ADD CONSTRAINT "GradingScale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingScaleItem" ADD CONSTRAINT "GradingScaleItem_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES "GradingScale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
