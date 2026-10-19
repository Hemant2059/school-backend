import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GuardianService } from '../services/guardian.service.js';
import { CreateGuardianDto, UpdateGuardianDto } from '../dto/guardian.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/guardians')
export class GuardianController {
  constructor(private readonly service: GuardianService) {}

  @Permissions('guardians.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateGuardianDto) { return this.service.create(tenantId, dto); }

  @Permissions('guardians.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('guardians.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('guardians.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateGuardianDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('guardians.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('guardians.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}