import { Module } from '@nestjs/common';
import { FiscalYearController } from './controllers/fiscal-year.controller.js';
import { FeeHeadController } from './controllers/fee-head.controller.js';
import { ClassFeeStructureController } from './controllers/class-fee-structure.controller.js';
import { ScholarshipSchemeController } from './controllers/scholarship-scheme.controller.js';
import { StudentScholarshipController } from './controllers/student-scholarship.controller.js';
import { FiscalYearService } from './services/fiscal-year.service.js';
import { FeeHeadService } from './services/fee-head.service.js';
import { ClassFeeStructureService } from './services/class-fee-structure.service.js';
import { ScholarshipSchemeService } from './services/scholarship-scheme.service.js';
import { StudentScholarshipService } from './services/student-scholarship.service.js';

@Module({
  controllers: [FiscalYearController, FeeHeadController, ClassFeeStructureController, ScholarshipSchemeController, StudentScholarshipController],
  providers: [FiscalYearService, FeeHeadService, ClassFeeStructureService, ScholarshipSchemeService, StudentScholarshipService],
  exports: [FiscalYearService, FeeHeadService, ClassFeeStructureService, ScholarshipSchemeService, StudentScholarshipService],
})
export class FeesModule {}