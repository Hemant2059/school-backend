import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';
import { StudentController } from './controllers/student.controller.js';
import { GuardianController } from './controllers/guardian.controller.js';
import { AddressController } from './controllers/address.controller.js';
import { StudentGuardianController } from './controllers/student-guardian.controller.js';
import { ParentController } from './controllers/parent.controller.js';
import { StudentService } from './services/student.service.js';
import { AddressService } from './services/address.service.js';
import { GuardianService } from './services/guardian.service.js';
import { StudentGuardianService } from './services/student-guardian.service.js';
import { ParentService } from './services/parent.service.js';
import { ParentGuard } from './guards/parent.guard.js';

@Module({
  imports: [BillingModule],
  controllers: [
    StudentController,
    GuardianController,
    AddressController,
    StudentGuardianController,
    ParentController,
  ],
  providers: [
    StudentService,
    AddressService,
    GuardianService,
    StudentGuardianService,
    ParentService,
    ParentGuard,
  ],
  exports: [StudentService, AddressService, GuardianService, StudentGuardianService],
})
export class StudentsModule {}
