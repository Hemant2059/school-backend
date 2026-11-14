import { Global, Module } from '@nestjs/common';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor.js';

@Global()
@Module({
  providers: [AuditLogInterceptor],
  exports: [AuditLogInterceptor],
})
export class CommonModule {}
