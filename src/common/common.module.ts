import { Global, Module } from '@nestjs/common';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor.js';
import { DocumentSequenceService } from './services/document-sequence.service.js';

@Global()
@Module({
  providers: [AuditLogInterceptor, DocumentSequenceService],
  exports: [AuditLogInterceptor, DocumentSequenceService],
})
export class CommonModule {}
