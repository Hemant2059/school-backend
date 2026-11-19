import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreditNoteService } from '../services/credit-note.service.js';
import { CreateCreditNoteDto, UpdateCreditNoteDto } from '../dto/credit-note.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlanFeature } from '../../common/decorators/plan-feature.decorator.js';

@PlanFeature('fee.management')
@Controller('tenants/:tenantId/credit-notes')
export class CreditNoteController {
  constructor(private readonly service: CreditNoteService) {}

  @Permissions('credit_notes.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateCreditNoteDto) { return this.service.create(tenantId, dto); }

  @Permissions('credit_notes.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('credit_notes.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('credit_notes.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateCreditNoteDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('credit_notes.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}