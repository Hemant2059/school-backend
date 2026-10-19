import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service.js';
import { CreateOrganizationDto, UpdateOrganizationDto, QueryOrganizationsDto } from '../dto/organization.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly service: OrganizationService) {}

  @Permissions('organizations.manage')
  @Post()
  create(@Body() dto: CreateOrganizationDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Permissions('organizations.read')
  @Get()
  findAll(@Query() q: QueryOrganizationsDto) { return this.service.findAll(q); }

  @Permissions('organizations.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('organizations.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) { return this.service.update(id, dto); }

  @Permissions('organizations.manage')
  @Delete(':id')
  softDelete(@Param('id') id: string) { return this.service.softDelete(id); }

  @Permissions('organizations.manage')
  @Delete(':id/permanent')
  hardDelete(@Param('id') id: string) { return this.service.hardDelete(id); }

  @Permissions('organizations.manage')
  @Post(':id/restore')
  restore(@Param('id') id: string) { return this.service.restore(id); }
}