-- AlterTable
ALTER TABLE "Guardian" DROP COLUMN "citizenshipNo",
ADD COLUMN     "citizenshipDetails" JSONB;
