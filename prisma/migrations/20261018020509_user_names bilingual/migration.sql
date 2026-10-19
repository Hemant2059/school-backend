-- AlterTable
ALTER TABLE "PlatformUser" DROP COLUMN "fullName",
ADD COLUMN     "firstNameEn" TEXT NOT NULL,
ADD COLUMN     "firstNameNe" TEXT,
ADD COLUMN     "lastNameEn" TEXT NOT NULL,
ADD COLUMN     "lastNameNe" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "firstNameEn" TEXT,
ADD COLUMN     "firstNameNe" TEXT,
ADD COLUMN     "lastNameEn" TEXT,
ADD COLUMN     "lastNameNe" TEXT;
