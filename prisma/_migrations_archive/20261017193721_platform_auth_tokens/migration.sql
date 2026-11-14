-- AlterTable
ALTER TABLE "PlatformUser" ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshTokenHash" TEXT;
