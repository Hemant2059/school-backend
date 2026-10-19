import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlanService } from '../services/plan.service.js';
import { CreatePlanDto, UpdatePlanDto, QueryPlansDto } from '../dto/plan.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('subscription-plans')
export class PlanController {
  constructor(private readonly service: PlanService) {}

  @Permissions('subscriptions.manage')
  @Post()
  create(@Body() dto: CreatePlanDto) { return this.service.create(dto); }

  @Permissions('subscriptions.read')
  @Get()
  findAll(@Query() q: QueryPlansDto) { return this.service.findAll(q); }

  @Permissions('subscriptions.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('subscriptions.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) { return this.service.update(id, dto); }

  @Permissions('subscriptions.manage')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}