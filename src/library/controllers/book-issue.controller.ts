import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookIssueService } from '../services/book-issue.service.js';
import { CreateBookIssueDto, UpdateBookIssueDto } from '../dto/library.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/book-issues')
export class BookIssueController {
  constructor(private readonly service: BookIssueService) {}

  @Permissions('library.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateBookIssueDto) { return this.service.create(tenantId, dto); }

  @Permissions('library.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('library.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('library.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateBookIssueDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('library.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('library.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}