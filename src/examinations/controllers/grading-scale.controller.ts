import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GradingScaleService } from '../services/grading-scale.service.js';
import { CreateGradingScaleDto, UpdateGradingScaleDto, CreateGradingScaleItemDto, UpdateGradingScaleItemDto } from '../dto/grading-scale.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/grading-scales')
export class GradingScaleController {
  constructor(private readonly service: GradingScaleService) {}

  @Permissions('grading_scales.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateGradingScaleDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('grading_scales.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('grading_scales.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('grading_scales.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateGradingScaleDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Permissions('grading_scales.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('grading_scales.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }

  // Items
  //
  // The tenant is now passed through to the item endpoints. They used to
  // resolve the item by id alone, which allowed a tenant to modify another
  // school's grade bands.
  @Permissions('grading_scales.manage')
  @Post(':id/items')
  createItem(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateGradingScaleItemDto,
  ) {
    return this.service.createItem(tenantId, id, dto);
  }

  @Permissions('grading_scales.manage')
  @Patch('items/:itemId')
  updateItem(
    @Param('tenantId') tenantId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateGradingScaleItemDto,
  ) {
    return this.service.updateItem(tenantId, itemId, dto);
  }

  @Permissions('grading_scales.manage')
  @Delete('items/:itemId')
  removeItem(@Param('tenantId') tenantId: string, @Param('itemId') itemId: string) {
    return this.service.removeItem(tenantId, itemId);
  }
}
