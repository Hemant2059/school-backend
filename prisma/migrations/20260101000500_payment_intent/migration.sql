-- Online fee payment intents (eSewa / Khalti / ConnectIPS / demo).
--
-- A parent (or the office) initiates the payment against a fee invoice;
-- the gateway's callback is signed/verified server-side before a receipt
-- is issued. The DEMO gateway simulates the same roundtrip entirely
-- locally so the flow is testable without merchant credentials.

-- Accepted online gateways.
CREATE TYPE "OnlinePaymentGateway" AS ENUM ('DEMO', 'ESEWA', 'KHALTI', 'CONNECTIPS');

-- Lifecycle of a payment intent.
CREATE TYPE "PaymentIntentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- Receipts from the demo gateway are recorded honestly as DEMO receipts.
ALTER TYPE "FeePaymentMethod" ADD VALUE 'DEMO';

CREATE TABLE "PaymentIntent" (
    "id"                TEXT NOT NULL,
    "tenantId"          TEXT NOT NULL,
    "invoiceId"         TEXT NOT NULL,
    "fiscalYearId"      TEXT NOT NULL,
    "enrollmentId"      TEXT NOT NULL,
    "gateway"           "OnlinePaymentGateway" NOT NULL,
    "status"            "PaymentIntentStatus" NOT NULL DEFAULT 'PENDING',
    "amount"            DECIMAL(12,2) NOT NULL,
    "paymentDateBs"     VARCHAR(10) NOT NULL,
    "gatewayRef"        TEXT,
    "initiationPayload" JSONB,
    "callbackPayload"   JSONB,
    "createdByUserId"   TEXT,
    "completedAt"       TIMESTAMP(3),
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PaymentIntent_tenantId_idx"        ON "PaymentIntent"("tenantId");
CREATE INDEX "PaymentIntent_tenantId_status_idx" ON "PaymentIntent"("tenantId", "status");
CREATE INDEX "PaymentIntent_invoiceId_idx"       ON "PaymentIntent"("invoiceId");
CREATE INDEX "PaymentIntent_gatewayRef_idx"      ON "PaymentIntent"("gatewayRef");

ALTER TABLE "PaymentIntent"
    ADD CONSTRAINT "PaymentIntent_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PaymentIntent"
    ADD CONSTRAINT "PaymentIntent_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
