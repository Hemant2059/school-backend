-- AlterTable
ALTER TABLE "PlatformUser" ADD COLUMN     "invitationAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "invitationExpiresAt" TIMESTAMP(3),
ADD COLUMN     "invitationToken" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_invitationToken_key" ON "PlatformUser"("invitationToken");
