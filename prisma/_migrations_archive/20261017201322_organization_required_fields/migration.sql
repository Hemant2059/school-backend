/*
  Warnings:

  - You are about to drop the column `name` on the `Organization` table. All the data in the column will be lost.
  - Made the column `address` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPersonName` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPersonPhone` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `municipality` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameEn` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameNp` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "name",
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "contactPersonName" SET NOT NULL,
ALTER COLUMN "contactPersonPhone" SET NOT NULL,
ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "municipality" SET NOT NULL,
ALTER COLUMN "nameEn" SET NOT NULL,
ALTER COLUMN "nameNp" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "province" SET NOT NULL;

-- RenameIndex
ALTER INDEX "Organization_panVatNumber_active_key" RENAME TO "Organization_panVatNumber_key";
