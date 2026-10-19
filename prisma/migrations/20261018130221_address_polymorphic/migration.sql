-- CreateEnum
CREATE TYPE "AddressEntityType" AS ENUM ('STUDENT', 'STAFF', 'GUARDIAN', 'USER', 'TENANT', 'ORGANIZATION', 'PLATFORM_USER');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_studentId_fkey";

-- DropIndex
DROP INDEX "Address_studentId_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "studentId",
ADD COLUMN     "entityId" TEXT NOT NULL,
ADD COLUMN     "entityType" "AddressEntityType" NOT NULL;

-- CreateIndex
CREATE INDEX "Address_entityType_entityId_idx" ON "Address"("entityType", "entityId");
