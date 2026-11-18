import { Module } from '@nestjs/common';
import { FeeBillingModule } from '../fee-billing/fee-billing.module.js';
import { PaymentIntentsController } from './controllers/payment-intents.controller.js';
import { GatewayCallbacksController } from './controllers/gateway-callbacks.controller.js';
import { TenantPaymentGatewaysController } from './controllers/tenant-payment-gateways.controller.js';
import { PaymentGatewayService } from './payment-gateway.service.js';
import { TenantPaymentGatewayService } from './tenant-payment-gateway.service.js';

@Module({
  imports: [FeeBillingModule],
  controllers: [
    PaymentIntentsController,
    GatewayCallbacksController,
    TenantPaymentGatewaysController,
  ],
  providers: [PaymentGatewayService, TenantPaymentGatewayService],
  exports: [PaymentGatewayService],
})
export class PaymentsModule {}
