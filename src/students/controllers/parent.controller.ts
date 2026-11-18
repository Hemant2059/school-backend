import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ParentGuard } from '../guards/parent.guard.js';
import { ParentService } from '../services/parent.service.js';

/**
 * The parent portal.
 *
 * Everything here is scoped to the children of the calling guardian. There
 * is no way to enumerate other students in the school.
 */
@Controller('tenants/:tenantId/parent')
export class ParentController {
  constructor(private readonly service: ParentService) {}

  /** The parent's children with basic school information. */
  @UseGuards(ParentGuard)
  @Get('children')
  myChildren(
    @Param('tenantId') tenantId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    return this.service.myChildren(tenantId, req.parentGuardianId);
  }

  /** One child's detail with the current enrollment. */
  @UseGuards(ParentGuard)
  @Get('children/:studentId')
  async myChild(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    const student = await this.service.myChild(
      tenantId,
      req.parentGuardianId,
      studentId,
    );
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  /** Attendance summary for the parent's child. */
  @UseGuards(ParentGuard)
  @Get('children/:studentId/attendance')
  attendance(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    return this.service.attendanceSummary(tenantId, req.parentGuardianId, studentId);
  }
}
