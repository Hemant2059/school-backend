import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LibraryBookService } from '../services/library-book.service.js';
import { CreateLibraryBookDto, UpdateLibraryBookDto } from '../dto/library.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/library-books')
export class LibraryBookController {
  constructor(private readonly service: LibraryBookService) {}

  @Permissions('library.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateLibraryBookDto) { return this.service.create(tenantId, dto); }

  @Permissions('library.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('library.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('library.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateLibraryBookDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('library.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('library.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}