import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GradingScaleService } from '../services/grading-scale.service.js';
import { CreateGradingScaleDto, UpdateGradingScaleDto, CreateGradingScaleItemDto, UpdateGradingScaleItemDto } from '../dto/grading-scale.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/grading-scales')
export class GradingScaleController {
  constructor(private readonly service: GradingScaleService) {}

  @Permissions('grading_scales.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateGradingScaleDto) { return this.service.create(tenantId, dto); }

  @Permissions('grading_scales.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('grading_scales.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('grading_scales.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateGradingScaleDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('grading_scales.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('grading_scales.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }

  // Items
  @Permissions('grading_scales.manage')
  @Post(':id/items')
  createItem(@Param('id') id: string, @Body() dto: CreateGradingScaleItemDto) { return this.service.createItem(id, dto); }

  @Permissions('grading_scales.manage')
  @Patch('items/:itemId')
  updateItem(@Param('itemId') itemId: string, @Body() dto: UpdateGradingScaleItemDto) { return this.service.updateItem(itemId, dto); }

  @Permissions('grading_scales.manage')
  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: string) { return this.service.removeItem(itemId); }
}