-- CreateEnum
CREATE TYPE "FeeInvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'VOIDED_BY_CREDIT_NOTE');

-- CreateEnum
CREATE TYPE "FeePaymentMethod" AS ENUM ('CASH', 'ESEWA', 'KHALTI', 'FONEPAY_QR', 'CONNECT_IPS', 'BANK_VOUCHER', 'CHEQUE');

-- CreateTable
CREATE TABLE "FeeInvoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "issueDateAd" TIMESTAMP(3) NOT NULL,
    "issueDateBs" VARCHAR(10) NOT NULL,
    "dueDateBs" VARCHAR(10) NOT NULL,
    "billedUpToBsMonth" INTEGER,
    "subtotalAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "previousDuesBroughtForward" DECIMAL(12,2) NOT NULL,
    "netPayableAmount" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL,
    "status" "FeeInvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "printCount" INTEGER NOT NULL DEFAULT 0,
    "isSyncedToIrd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeInvoiceItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "bsMonth" INTEGER,
    "description" TEXT NOT NULL,
    "grossAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "netAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptNumber" TEXT NOT NULL,
    "paymentDateAd" TIMESTAMP(3) NOT NULL,
    "paymentDateBs" VARCHAR(10) NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "FeePaymentMethod" NOT NULL,
    "gatewayTransactionId" TEXT,
    "gatewayResponsePayload" JSONB,
    "collectedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditNote" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "creditNoteNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "approvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_idx" ON "FeeInvoice"("tenantId");

-- CreateIndex
CREATE INDEX "FeeInvoice_enrollmentId_idx" ON "FeeInvoice"("enrollmentId");

-- CreateIndex
CREATE INDEX "FeeInvoice_deletedAt_idx" ON "FeeInvoice"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeeInvoice_tenantId_fiscalYearId_invoiceNumber_key" ON "FeeInvoice"("tenantId", "fiscalYearId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "FeeInvoiceItem_tenantId_idx" ON "FeeInvoiceItem"("tenantId");

-- CreateIndex
CREATE INDEX "FeeInvoiceItem_invoiceId_idx" ON "FeeInvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "FeePayment_tenantId_idx" ON "FeePayment"("tenantId");

-- CreateIndex
CREATE INDEX "FeePayment_fiscalYearId_idx" ON "FeePayment"("fiscalYearId");

-- CreateIndex
CREATE INDEX "FeePayment_enrollmentId_idx" ON "FeePayment"("enrollmentId");

-- CreateIndex
CREATE INDEX "FeePayment_invoiceId_idx" ON "FeePayment"("invoiceId");

-- CreateIndex
CREATE INDEX "FeePayment_deletedAt_idx" ON "FeePayment"("deletedAt");

-- CreateIndex
CREATE INDEX "CreditNote_tenantId_idx" ON "CreditNote"("tenantId");

-- CreateIndex
CREATE INDEX "CreditNote_invoiceId_idx" ON "CreditNote"("invoiceId");

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_collectedByUserId_fkey" FOREIGN KEY ("collectedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
