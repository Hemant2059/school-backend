-- AlterTable
ALTER TABLE "AcademicCalendarEvent" DROP COLUMN "title",
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleNe" TEXT NOT NULL;
