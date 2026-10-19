import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TransferCertificateService } from '../services/transfer-certificate.service.js';
import { CreateTransferCertificateDto, UpdateTransferCertificateDto } from '../dto/transfer-certificate.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/transfer-certificates')
export class TransferCertificateController {
  constructor(private readonly service: TransferCertificateService) {}

  @Permissions('transfer_certificates.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateTransferCertificateDto) { return this.service.create(tenantId, dto); }

  @Permissions('transfer_certificates.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('transfer_certificates.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('transfer_certificates.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateTransferCertificateDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('transfer_certificates.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('transfer_certificates.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}