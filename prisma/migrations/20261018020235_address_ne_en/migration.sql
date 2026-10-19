-- DropIndex
DROP INDEX "Organization_province_district_idx";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "address",
DROP COLUMN "district",
DROP COLUMN "municipality",
DROP COLUMN "province",
DROP COLUMN "tole",
ADD COLUMN     "addressEn" TEXT,
ADD COLUMN     "addressNe" TEXT,
ADD COLUMN     "districtCode" TEXT NOT NULL,
ADD COLUMN     "districtEn" TEXT,
ADD COLUMN     "districtNe" TEXT NOT NULL,
ADD COLUMN     "municipalityCode" TEXT NOT NULL,
ADD COLUMN     "municipalityEn" TEXT,
ADD COLUMN     "municipalityNe" TEXT NOT NULL,
ADD COLUMN     "provinceCode" TEXT NOT NULL,
ADD COLUMN     "provinceEn" TEXT,
ADD COLUMN     "provinceNe" TEXT NOT NULL,
ADD COLUMN     "toleEn" TEXT,
ADD COLUMN     "toleNe" TEXT,
ALTER COLUMN "wardNumber" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Organization_provinceCode_districtCode_municipalityCode_idx" ON "Organization"("provinceCode", "districtCode", "municipalityCode");
