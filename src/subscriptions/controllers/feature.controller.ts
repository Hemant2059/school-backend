import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FeatureService } from '../services/feature.service.js';
import { CreateFeatureDto, UpdateFeatureDto, QueryFeaturesDto } from '../dto/feature.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('features')
export class FeatureController {
  constructor(private readonly service: FeatureService) {}

  @Permissions('subscriptions.manage')
  @Post()
  create(@Body() dto: CreateFeatureDto) { return this.service.create(dto); }

  @Permissions('subscriptions.read')
  @Get()
  findAll(@Query() q: QueryFeaturesDto) { return this.service.findAll(q); }

  @Permissions('subscriptions.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('subscriptions.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeatureDto) { return this.service.update(id, dto); }

  @Permissions('subscriptions.manage')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}