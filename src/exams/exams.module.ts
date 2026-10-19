import { Module } from '@nestjs/common';
import { ExamController } from './controllers/exam.controller.js';
import { ExamService } from './services/exam.service.js';
import { ExamScheduleController } from './controllers/exam-schedule.controller.js';
import { ExamScheduleService } from './services/exam-schedule.service.js';
import { ExamMarkController } from './controllers/exam-mark.controller.js';
import { ExamMarkService } from './services/exam-mark.service.js';
import { StudentExamSummaryController } from './controllers/student-exam-summary.controller.js';
import { StudentExamSummaryService } from './services/student-exam-summary.service.js';

@Module({
  controllers: [ExamController, ExamScheduleController, ExamMarkController, StudentExamSummaryController],
  providers: [ExamService, ExamScheduleService, ExamMarkService, StudentExamSummaryService],
  exports: [ExamService, ExamScheduleService, ExamMarkService, StudentExamSummaryService],
})
export class ExamsModule {}