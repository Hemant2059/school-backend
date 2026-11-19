import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { FeeInvoiceController } from './controllers/fee-invoice.controller.js';
import { FeeInvoiceItemController } from './controllers/fee-invoice-item.controller.js';
import { FeePaymentController } from './controllers/fee-payment.controller.js';
import { CreditNoteController } from './controllers/credit-note.controller.js';
import { FeeInvoiceService } from './services/fee-invoice.service.js';
import { FeeInvoiceItemService } from './services/fee-invoice-item.service.js';
import { FeePaymentService } from './services/fee-payment.service.js';
import { CreditNoteService } from './services/credit-note.service.js';
import { FeeEngineService } from './services/fee-engine.service.js';

@Module({
  imports: [NotificationsModule],
  controllers: [FeeInvoiceController, FeeInvoiceItemController, FeePaymentController, CreditNoteController],
  providers: [
    FeeInvoiceService,
    FeeInvoiceItemService,
    FeePaymentService,
    CreditNoteService,
    FeeEngineService,
  ],
  exports: [
    FeeInvoiceService,
    FeeInvoiceItemService,
    FeePaymentService,
    CreditNoteService,
    FeeEngineService,
  ],
})
export class FeeBillingModule {}
