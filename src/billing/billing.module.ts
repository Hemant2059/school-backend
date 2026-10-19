import { Module } from '@nestjs/common';
import { SubscriptionController } from './controllers/subscription.controller.js';
import { InvoiceController } from './controllers/invoice.controller.js';
import { PaymentController } from './controllers/payment.controller.js';
import { TenantSubscriptionService } from './services/subscription.service.js';
import { TenantInvoiceService } from './services/invoice.service.js';
import { TenantPaymentService } from './services/payment.service.js';

@Module({
  controllers: [SubscriptionController, InvoiceController, PaymentController],
  providers: [TenantSubscriptionService, TenantInvoiceService, TenantPaymentService],
  exports: [TenantSubscriptionService, TenantInvoiceService, TenantPaymentService],
})
export class BillingModule {}