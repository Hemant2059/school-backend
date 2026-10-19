import { Module } from '@nestjs/common';
import { AcademicYearController } from './controllers/academic-year.controller.js';
import { AcademicYearService } from './services/academic-year.service.js';
import { StreamController } from './controllers/stream.controller.js';
import { StreamService } from './services/stream.service.js';
import { GradeLevelController } from './controllers/grade-level.controller.js';
import { GradeLevelService } from './services/grade-level.service.js';
import { SectionController } from './controllers/section.controller.js';
import { SectionService } from './services/section.service.js';
import { StaffProfileController } from './controllers/staff-profile.controller.js';
import { StaffProfileService } from './services/staff-profile.service.js';
import { SubjectController } from './controllers/subject.controller.js';
import { SubjectService } from './services/subject.service.js';
import { GradeSubjectController } from './controllers/grade-subject.controller.js';
import { GradeSubjectService } from './services/grade-subject.service.js';
import { AcademicCalendarEventController } from './controllers/academic-calendar-event.controller.js';
import { AcademicCalendarEventService } from './services/academic-calendar-event.service.js';

@Module({
  controllers: [AcademicYearController, StreamController, GradeLevelController, SectionController, StaffProfileController, SubjectController, GradeSubjectController, AcademicCalendarEventController],
  providers: [AcademicYearService, StreamService, GradeLevelService, SectionService, StaffProfileService, SubjectService, GradeSubjectService, AcademicCalendarEventService],
  exports: [AcademicYearService, StreamService, GradeLevelService, SectionService, StaffProfileService, SubjectService, GradeSubjectService, AcademicCalendarEventService],
})
export class AcademicsModule {}