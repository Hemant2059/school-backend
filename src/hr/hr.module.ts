import { Module } from '@nestjs/common';
import { TeacherSubjectAllocationController } from './controllers/teacher-subject-allocation.controller.js';
import { PayrollRunController } from './controllers/payroll-run.controller.js';
import { SalarySlipController } from './controllers/salary-slip.controller.js';
import { PayrollRemittanceController } from './controllers/payroll-remittance.controller.js';
import { TeacherSubjectAllocationService } from './services/teacher-subject-allocation.service.js';
import { PayrollRunService } from './services/payroll-run.service.js';
import { SalarySlipService } from './services/salary-slip.service.js';
import { PayrollEngineService } from './services/payroll-engine.service.js';
import { PayrollRemittanceService } from './services/payroll-remittance.service.js';

@Module({
  controllers: [
    TeacherSubjectAllocationController,
    PayrollRunController,
    SalarySlipController,
    PayrollRemittanceController,
  ],
  providers: [
    TeacherSubjectAllocationService,
    PayrollRunService,
    SalarySlipService,
    PayrollEngineService,
    PayrollRemittanceService,
  ],
  exports: [
    TeacherSubjectAllocationService,
    PayrollRunService,
    SalarySlipService,
    PayrollEngineService,
    PayrollRemittanceService,
  ],
})
export class HrModule {}
