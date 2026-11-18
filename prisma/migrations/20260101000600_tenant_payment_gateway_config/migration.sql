-- Per-tenant online payment gateway credentials.
--
-- Secrets are AES-256-GCM encrypted by the application before they reach
-- the database, so a dump of this table without the platform master key
-- (PAYMENT_CONFIG_MASTER_KEY, kept in the environment) is useless.

CREATE TABLE "TenantPaymentGatewayConfig" (
    "id"                      TEXT NOT NULL,
    "tenantId"                TEXT NOT NULL,
    "gateway"                 "OnlinePaymentGateway" NOT NULL,
    "environment"             VARCHAR(20) NOT NULL DEFAULT 'sandbox',
    "isEnabled"               BOOLEAN NOT NULL DEFAULT TRUE,
    "merchantIdEncrypted"     TEXT,
    "secretKeyEncrypted"      TEXT,
    "appName"                 VARCHAR(60),
    "privateKeyPemEncrypted"  TEXT,
    "baseUrl"                 VARCHAR(300),
    "configuredByUserId"      TEXT,
    "createdAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"               TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantPaymentGatewayConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantPaymentGatewayConfig_tenantId_gateway_key"
    ON "TenantPaymentGatewayConfig"("tenantId", "gateway");

CREATE INDEX "TenantPaymentGatewayConfig_tenantId_idx"
    ON "TenantPaymentGatewayConfig"("tenantId");

ALTER TABLE "TenantPaymentGatewayConfig"
    ADD CONSTRAINT "TenantPaymentGatewayConfig_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
