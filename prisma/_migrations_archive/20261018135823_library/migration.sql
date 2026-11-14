-- CreateEnum
CREATE TYPE "BookIssueStatus" AS ENUM ('ISSUED', 'RETURNED', 'OVERDUE', 'LOST');

-- CreateTable
CREATE TABLE "LibraryBook" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "isbn" TEXT,
    "category" TEXT,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LibraryBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIssue" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "issueDateAd" TIMESTAMP(3) NOT NULL,
    "issueDateBs" VARCHAR(10),
    "dueDateAd" TIMESTAMP(3) NOT NULL,
    "dueDateBs" VARCHAR(10),
    "returnDateAd" TIMESTAMP(3),
    "returnDateBs" VARCHAR(10),
    "fineAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "BookIssueStatus" NOT NULL DEFAULT 'ISSUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BookIssue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LibraryBook_tenantId_idx" ON "LibraryBook"("tenantId");

-- CreateIndex
CREATE INDEX "LibraryBook_deletedAt_idx" ON "LibraryBook"("deletedAt");

-- CreateIndex
CREATE INDEX "BookIssue_tenantId_idx" ON "BookIssue"("tenantId");

-- CreateIndex
CREATE INDEX "BookIssue_bookId_idx" ON "BookIssue"("bookId");

-- CreateIndex
CREATE INDEX "BookIssue_studentId_idx" ON "BookIssue"("studentId");

-- CreateIndex
CREATE INDEX "BookIssue_deletedAt_idx" ON "BookIssue"("deletedAt");

-- AddForeignKey
ALTER TABLE "LibraryBook" ADD CONSTRAINT "LibraryBook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "LibraryBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
