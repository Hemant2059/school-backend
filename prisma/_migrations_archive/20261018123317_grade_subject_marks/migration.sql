-- AlterTable
ALTER TABLE "GradeSubject" DROP COLUMN "credits",
DROP COLUMN "fullMarks",
DROP COLUMN "passMarks",
ADD COLUMN     "creditHours" INTEGER,
ADD COLUMN     "internalCreditHours" INTEGER,
ADD COLUMN     "internalFullMarks" INTEGER,
ADD COLUMN     "internalPassMarks" INTEGER,
ADD COLUMN     "theoryCreditHours" INTEGER,
ADD COLUMN     "theoryFullMarks" INTEGER,
ADD COLUMN     "theoryPassMarks" INTEGER;
