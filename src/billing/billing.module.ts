import { Module } from '@nestjs/common';
import { SubscriptionController } from './controllers/subscription.controller.js';
import { InvoiceController } from './controllers/invoice.controller.js';
import { PaymentController } from './controllers/payment.controller.js';
import { TenantSubscriptionService } from './services/subscription.service.js';
import { TenantInvoiceService } from './services/invoice.service.js';
import { TenantPaymentService } from './services/payment.service.js';
import { TenantEntitlementService } from './services/tenant-entitlement.service.js';

@Module({
  controllers: [SubscriptionController, InvoiceController, PaymentController],
  providers: [
    TenantEntitlementService,
    TenantSubscriptionService,
    TenantInvoiceService,
    TenantPaymentService,
  ],
  exports: [
    TenantEntitlementService,
    TenantSubscriptionService,
    TenantInvoiceService,
    TenantPaymentService,
  ],
})
export class BillingModule {}
