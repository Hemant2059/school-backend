-- ConnectIPS authenticates with two identifiers: MERCHANTID and APPID.
-- The first schema only had merchantId — add appId, also encrypted.
ALTER TABLE "TenantPaymentGatewayConfig"
    ADD COLUMN "appIdEncrypted" TEXT;
