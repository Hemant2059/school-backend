import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AttendanceService } from '../services/attendance.service.js';
import {
  BulkAttendanceDto,
  MarkAttendanceDto,
  QueryAttendanceDto,
  UpdateAttendanceDto,
} from '../dto/attendance.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';

@Controller('tenants/:tenantId/attendance')
export class AttendanceController {
  constructor(
    private readonly service: AttendanceService,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  @Permissions('attendance.manage')
  @Post()
  async mark(
    @Param('tenantId') tenantId: string,
    @Body() dto: MarkAttendanceDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'attendance.tracking');
    return this.service.mark(tenantId, dto, userId);
  }

  /** Marks a whole section at once; unmarked students are recorded absent. */
  @Permissions('attendance.manage')
  @Post('bulk')
  async markBulk(
    @Param('tenantId') tenantId: string,
    @Body() dto: BulkAttendanceDto,
    @CurrentUser('id') userId: string,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'attendance.tracking');
    return this.service.markBulk(tenantId, dto, userId);
  }

  @Permissions('attendance.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: QueryAttendanceDto) {
    return this.service.findAll(tenantId, query);
  }

  /** The attendance summary of one student over a period. */
  @Permissions('attendance.read')
  @Get('summary')
  summary(
    @Param('tenantId') tenantId: string,
    @Query('enrollmentId') enrollmentId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.summary(
      tenantId,
      enrollmentId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Permissions('attendance.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('attendance.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Permissions('attendance.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('attendance.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
