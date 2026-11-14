-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "panVatNumber" TEXT,
    "createdByPlatformUserId" TEXT NOT NULL,
    "resellerPartnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_panVatNumber_key" ON "Organization"("panVatNumber");

-- CreateIndex
CREATE INDEX "Organization_createdByPlatformUserId_idx" ON "Organization"("createdByPlatformUserId");

-- CreateIndex
CREATE INDEX "Organization_resellerPartnerId_idx" ON "Organization"("resellerPartnerId");

-- CreateIndex
CREATE INDEX "Organization_deletedAt_idx" ON "Organization"("deletedAt");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdByPlatformUserId_fkey" FOREIGN KEY ("createdByPlatformUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_resellerPartnerId_fkey" FOREIGN KEY ("resellerPartnerId") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
