import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StreamService } from '../services/stream.service.js';
import { CreateStreamDto, UpdateStreamDto } from '../dto/stream.dto.js';
import { QueryStreamsDto } from '../dto/query.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/streams')
export class StreamController {
  constructor(private readonly service: StreamService) {}

  @Permissions('streams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStreamDto) { return this.service.create(tenantId, dto); }

  @Permissions('streams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryStreamsDto) { return this.service.findAll(tenantId, q); }

  @Permissions('streams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('streams.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStreamDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('streams.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('streams.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}