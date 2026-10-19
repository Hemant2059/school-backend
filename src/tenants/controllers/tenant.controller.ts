import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TenantService } from '../services/tenant.service.js';
import { CreateTenantDto, UpdateTenantDto, QueryTenantsDto } from '../dto/tenant.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @Public()
  @Get('by-subdomain/:subdomain')
  findBySubdomain(@Param('subdomain') subdomain: string) {
    return this.service.findBySubdomain(subdomain);
  }

  @Permissions('tenants.manage')
  @Post()
  create(@Body() dto: CreateTenantDto, @Req() req: any) { return this.service.create(dto, req.user.id); }

  @Permissions('tenants.read')
  @Get()
  findAll(@Query() q: QueryTenantsDto) { return this.service.findAll(q); }

  @Permissions('tenants.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('tenants.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) { return this.service.update(id, dto); }

  @Permissions('tenants.manage')
  @Delete(':id')
  softDelete(@Param('id') id: string) { return this.service.softDelete(id); }

  @Permissions('tenants.manage')
  @Delete(':id/permanent')
  hardDelete(@Param('id') id: string) { return this.service.hardDelete(id); }

  @Permissions('tenants.manage')
  @Post(':id/restore')
  restore(@Param('id') id: string) { return this.service.restore(id); }
}