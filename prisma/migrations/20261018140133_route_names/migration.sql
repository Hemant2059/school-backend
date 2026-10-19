-- AlterTable
ALTER TABLE "TransportRoute" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionNe" TEXT,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameNe" TEXT NOT NULL;
