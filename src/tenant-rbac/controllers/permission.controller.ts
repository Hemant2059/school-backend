import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TenantPermissionService } from '../services/permission.service.js';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlatformOnly } from '../../auth/decorators/platform-only.decorator.js';

/**
 * The tenant permission catalogue.
 *
 * `Permission` rows are shared by every tenant (the table has no `tenantId`
 * — it is a common vocabulary, not per-school data). Reading it is allowed
 * for tenant principals so they can assign permissions to their own roles,
 * but *mutating* it is platform-only: a single tenant deleting a shared
 * permission would strip that capability from every other school.
 */
@Controller('permissions')
export class PermissionController {
  constructor(private readonly service: TenantPermissionService) {}

  @PlatformOnly()
  @Permissions('permissions.manage')
  @Post()
  create(@Body() dto: CreatePermissionDto) { return this.service.create(dto); }

  @Permissions('permissions.read')
  @Get()
  findAll(@Query() q: any) { return this.service.findAll(q); }

  @Permissions('permissions.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @PlatformOnly()
  @Permissions('permissions.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) { return this.service.update(id, dto); }

  @PlatformOnly()
  @Permissions('permissions.manage')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
