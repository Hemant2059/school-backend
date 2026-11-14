import { Module } from '@nestjs/common';
import { TimetableController } from './controllers/timetable.controller.js';
import { TimetableService } from './services/timetable.service.js';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
