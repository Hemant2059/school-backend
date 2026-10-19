-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'LOCKED');

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradingScaleId" TEXT,
    "name" TEXT NOT NULL,
    "termWeightage" DECIMAL(5,2),
    "startDateAd" TIMESTAMP(3) NOT NULL,
    "endDateAd" TIMESTAMP(3) NOT NULL,
    "startDateBs" VARCHAR(10) NOT NULL,
    "endDateBs" VARCHAR(10) NOT NULL,
    "resultPublishDateAd" TIMESTAMP(3),
    "resultPublishDateBs" VARCHAR(10),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSchedule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "gradeSubjectId" TEXT NOT NULL,
    "examDateAd" TIMESTAMP(3) NOT NULL,
    "examDateBs" VARCHAR(10) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "theoryFullMarks" DECIMAL(6,2),
    "theoryPassMarks" DECIMAL(6,2),
    "internalFullMarks" DECIMAL(6,2),
    "internalPassMarks" DECIMAL(6,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMark" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examScheduleId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "theoryMarksObtained" DECIMAL(5,2),
    "isTheoryAbsent" BOOLEAN NOT NULL DEFAULT false,
    "internalMarksObtained" DECIMAL(5,2),
    "isInternalAbsent" BOOLEAN NOT NULL DEFAULT false,
    "internalBreakdown" JSONB,
    "theoryGrade" VARCHAR(3),
    "theoryGp" DECIMAL(3,2),
    "internalGrade" VARCHAR(3),
    "internalGp" DECIMAL(3,2),
    "finalSubjectGrade" VARCHAR(3),
    "finalSubjectGp" DECIMAL(3,2),
    "enteredByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentExamSummary" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalMarksObtained" DECIMAL(8,2),
    "percentage" DECIMAL(5,2),
    "gpa" DECIMAL(3,2),
    "finalGrade" TEXT,
    "rankInSection" INTEGER,
    "rankInGrade" INTEGER,
    "totalAttendanceDays" INTEGER,
    "presentDays" INTEGER,
    "classTeacherRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentExamSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exam_tenantId_idx" ON "Exam"("tenantId");

-- CreateIndex
CREATE INDEX "Exam_academicYearId_idx" ON "Exam"("academicYearId");

-- CreateIndex
CREATE INDEX "Exam_deletedAt_idx" ON "Exam"("deletedAt");

-- CreateIndex
CREATE INDEX "ExamSchedule_tenantId_idx" ON "ExamSchedule"("tenantId");

-- CreateIndex
CREATE INDEX "ExamSchedule_examId_idx" ON "ExamSchedule"("examId");

-- CreateIndex
CREATE INDEX "ExamSchedule_gradeSubjectId_idx" ON "ExamSchedule"("gradeSubjectId");

-- CreateIndex
CREATE INDEX "ExamSchedule_deletedAt_idx" ON "ExamSchedule"("deletedAt");

-- CreateIndex
CREATE INDEX "ExamMark_tenantId_idx" ON "ExamMark"("tenantId");

-- CreateIndex
CREATE INDEX "ExamMark_enrollmentId_idx" ON "ExamMark"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamMark_examScheduleId_enrollmentId_key" ON "ExamMark"("examScheduleId", "enrollmentId");

-- CreateIndex
CREATE INDEX "StudentExamSummary_tenantId_idx" ON "StudentExamSummary"("tenantId");

-- CreateIndex
CREATE INDEX "StudentExamSummary_studentId_idx" ON "StudentExamSummary"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExamSummary_examId_studentId_key" ON "StudentExamSummary"("examId", "studentId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES "GradingScale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSchedule" ADD CONSTRAINT "ExamSchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSchedule" ADD CONSTRAINT "ExamSchedule_gradeSubjectId_fkey" FOREIGN KEY ("gradeSubjectId") REFERENCES "GradeSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES "ExamSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_enteredByUserId_fkey" FOREIGN KEY ("enteredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExamSummary" ADD CONSTRAINT "StudentExamSummary_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExamSummary" ADD CONSTRAINT "StudentExamSummary_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
