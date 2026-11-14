-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "establishedDate",
DROP COLUMN "nameNp",
ADD COLUMN     "establishedDateAd" TIMESTAMP(3),
ADD COLUMN     "establishedDateBs" TEXT,
ADD COLUMN     "nameNe" TEXT NOT NULL;
