import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { StudentGuard } from '../guards/student.guard.js';
import { StudentPortalService } from '../services/student-portal.service.js';

/**
 * The student portal. Every endpoint is scoped to the calling student's
 * own records — there is no way to read another student's data.
 */
@Controller('tenants/:tenantId/student')
@UseGuards(StudentGuard)
export class StudentPortalController {
  constructor(private readonly service: StudentPortalService) {}

  /** Own profile with the current enrollment. */
  @Get('me')
  async me(
    @Param('tenantId') tenantId: string,
    @Req() req: Request & { studentId: string },
  ) {
    const student = await this.service.myProfile(tenantId, req.studentId);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  /** Own published exam results. */
  @Get('me/exams')
  exams(
    @Param('tenantId') tenantId: string,
    @Req() req: Request & { studentId: string },
  ) {
    return this.service.myExams(tenantId, req.studentId);
  }

  /** Own attendance summary for the last 30 days. */
  @Get('me/attendance')
  attendance(
    @Param('tenantId') tenantId: string,
    @Req() req: Request & { studentId: string },
  ) {
    return this.service.myAttendance(tenantId, req.studentId);
  }
}
