-- Per-tenant API keys for integrations (Zapier, Google Sheets, webhooks).
--
-- Keys are high-entropy random secrets; only the SHA-256 hash is stored.
-- The raw key is returned exactly once, at creation time.
CREATE TABLE "ApiKey" (
    "id"              TEXT NOT NULL,
    "tenantId"        TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "prefix"          VARCHAR(20) NOT NULL,
    "hash"            TEXT NOT NULL,
    "lastUsedAt"      TIMESTAMP(3),
    "expiresAt"       TIMESTAMP(3),
    "revokedAt"       TIMESTAMP(3),
    "createdByUserId" TEXT,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApiKey_tenantId_idx" ON "ApiKey"("tenantId");
CREATE INDEX "ApiKey_prefix_idx"   ON "ApiKey"("prefix");

ALTER TABLE "ApiKey"
    ADD CONSTRAINT "ApiKey_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
