import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { ReportCardsModule } from '../report-cards/report-cards.module.js';
import { StudentController } from './controllers/student.controller.js';
import { GuardianController } from './controllers/guardian.controller.js';
import { AddressController } from './controllers/address.controller.js';
import { StudentGuardianController } from './controllers/student-guardian.controller.js';
import { ParentController } from './controllers/parent.controller.js';
import { StudentImportController } from './controllers/student-import.controller.js';
import { StudentPortalController } from './controllers/student-portal.controller.js';
import { StudentService } from './services/student.service.js';
import { AddressService } from './services/address.service.js';
import { GuardianService } from './services/guardian.service.js';
import { StudentGuardianService } from './services/student-guardian.service.js';
import { ParentService } from './services/parent.service.js';
import { StudentImportService } from './services/student-import.service.js';
import { StudentPortalService } from './services/student-portal.service.js';
import { StudentGuard } from './guards/student.guard.js';
import { ParentGuard } from './guards/parent.guard.js';

@Module({
  imports: [BillingModule, PaymentsModule, ReportCardsModule],
  controllers: [
    StudentController,
    GuardianController,
    AddressController,
    StudentGuardianController,
    ParentController,
    StudentImportController,
    StudentPortalController,
  ],
  providers: [
    StudentService,
    AddressService,
    GuardianService,
    StudentGuardianService,
    ParentService,
    ParentGuard,
    StudentImportService,
    StudentPortalService,
    StudentGuard,
  ],
  exports: [
    StudentService,
    AddressService,
    GuardianService,
    StudentGuardianService,
    StudentPortalService,
  ],
})
export class StudentsModule {}
