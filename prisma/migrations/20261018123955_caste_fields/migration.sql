-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "casteEthnicityCode" TEXT NOT NULL,
DROP COLUMN "casteEthnicity",
ADD COLUMN     "casteEthnicity" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CasteEthnicity";
