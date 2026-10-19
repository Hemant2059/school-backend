-- DropForeignKey
ALTER TABLE "StudentExamSummary" DROP CONSTRAINT "StudentExamSummary_studentId_fkey";

-- DropIndex
DROP INDEX "StudentExamSummary_examId_studentId_key";

-- DropIndex
DROP INDEX "StudentExamSummary_studentId_idx";

-- AlterTable
ALTER TABLE "StudentExamSummary" DROP COLUMN "studentId",
ADD COLUMN     "enrollmentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "StudentExamSummary_enrollmentId_idx" ON "StudentExamSummary"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExamSummary_examId_enrollmentId_key" ON "StudentExamSummary"("examId", "enrollmentId");

-- AddForeignKey
ALTER TABLE "StudentExamSummary" ADD CONSTRAINT "StudentExamSummary_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
