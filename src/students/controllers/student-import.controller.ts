import { Controller, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { StudentImportService } from '../services/student-import.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

/**
 * Bulk student admission.
 *
 * Raw CSV body (Content-Type: text/csv) or JSON wrapper { "csv": "..." }.
 * Responds with { total, created, duplicates, errors[] } — rows that fail
 * validation are reported by line number without aborting the import.
 */
@Controller('tenants/:tenantId/students')
export class StudentImportController {
  constructor(private readonly service: StudentImportService) {}

  @Permissions('students.manage')
  @Post('import')
  importCsv(@Param('tenantId') tenantId: string, @Req() req: Request) {
    const body = req.body as unknown;
    const csv =
      typeof body === 'string'
        ? body
        : (body as { csv?: string } | undefined)?.csv;
    return this.service.importCsv(tenantId, csv ?? '');
  }
}
