import { Module } from '@nestjs/common';
import { EnrollmentController } from './controllers/enrollment.controller.js';
import { EnrollmentService } from './services/enrollment.service.js';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentsModule {}