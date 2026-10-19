import { Module } from '@nestjs/common';
import { TransferCertificateController } from './controllers/transfer-certificate.controller.js';
import { TransferCertificateService } from './services/transfer-certificate.service.js';

@Module({
  controllers: [TransferCertificateController],
  providers: [TransferCertificateService],
  exports: [TransferCertificateService],
})
export class TransferCertificatesModule {}