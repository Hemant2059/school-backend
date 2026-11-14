import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { BookIssueService } from '../services/book-issue.service.js';
import { CreateBookIssueDto, UpdateBookIssueDto } from '../dto/library.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

class ReturnBookDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  returnedAt?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  returnedAtBs?: string;
}

@Controller('tenants/:tenantId/book-issues')
export class BookIssueController {
  constructor(private readonly service: BookIssueService) {}

  @Permissions('library.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateBookIssueDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('library.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('library.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('library.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookIssueDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  /** Returns a book and puts the copy back on the shelf. */
  @Permissions('library.manage')
  @Post(':id/return')
  returnBook(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: ReturnBookDto,
  ) {
    return this.service.returnBook(tenantId, id, dto.returnedAt ?? new Date(), dto.returnedAtBs);
  }

  /** Flags the loans that are past their due date. */
  @Permissions('library.manage')
  @Post('mark-overdue')
  markOverdue(@Param('tenantId') tenantId: string) {
    return this.service.markOverdue(tenantId);
  }

  @Permissions('library.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('library.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
