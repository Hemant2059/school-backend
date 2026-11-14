import { Module } from '@nestjs/common';
import { TeacherSubjectAllocationController } from './controllers/teacher-subject-allocation.controller.js';
import { PayrollRunController } from './controllers/payroll-run.controller.js';
import { SalarySlipController } from './controllers/salary-slip.controller.js';
import { TeacherSubjectAllocationService } from './services/teacher-subject-allocation.service.js';
import { PayrollRunService } from './services/payroll-run.service.js';
import { SalarySlipService } from './services/salary-slip.service.js';
import { PayrollEngineService } from './services/payroll-engine.service.js';

@Module({
  controllers: [TeacherSubjectAllocationController, PayrollRunController, SalarySlipController],
  providers: [
    TeacherSubjectAllocationService,
    PayrollRunService,
    SalarySlipService,
    PayrollEngineService,
  ],
  exports: [
    TeacherSubjectAllocationService,
    PayrollRunService,
    SalarySlipService,
    PayrollEngineService,
  ],
})
export class HrModule {}
