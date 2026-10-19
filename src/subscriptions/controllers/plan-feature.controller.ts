import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { PlanFeatureService } from '../services/plan-feature.service.js';
import { AssignPlanFeatureDto, ReplacePlanFeaturesDto, UpdatePlanFeatureDto } from '../dto/plan-feature.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('subscription-plans/:planId/features')
export class PlanFeatureController {
  constructor(private readonly service: PlanFeatureService) {}

  @Permissions('subscriptions.read')
  @Get()
  list(@Param('planId') planId: string) { return this.service.list(planId); }

  @Permissions('subscriptions.manage')
  @Post()
  add(@Param('planId') planId: string, @Body() dto: AssignPlanFeatureDto) { return this.service.add(planId, dto); }

  @Permissions('subscriptions.manage')
  @Put()
  replace(@Param('planId') planId: string, @Body() dto: ReplacePlanFeaturesDto) { return this.service.replace(planId, dto.features); }

  @Permissions('subscriptions.manage')
  @Patch(':featureCode')
  update(@Param('planId') planId: string, @Param('featureCode') featureCode: string, @Body() dto: UpdatePlanFeatureDto) {
    return this.service.update(planId, featureCode, dto);
  }

  @Permissions('subscriptions.manage')
  @Delete(':featureCode')
  remove(@Param('planId') planId: string, @Param('featureCode') featureCode: string) {
    return this.service.remove(planId, featureCode);
  }
}