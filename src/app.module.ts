import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { validateEnv } from './config/env.validation.js';
import { PrismaModule } from './prisma.module.js';
import { PlatformModule } from './platform/platform.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SubscriptionsModule } from './subscriptions/subscriptions.module.js';
import { OrganizationsModule } from './organizations/organizations.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { TenantRbacModule } from './tenant-rbac/tenant-rbac.module.js';
import { BillingModule } from './billing/billing.module.js';
import { AcademicsModule } from './academics/academics.module.js';
import { StudentsModule } from './students/students.module.js';
import { ExaminationsModule } from './examinations/examinations.module.js';
import { ExamsModule } from './exams/exams.module.js';
import { FeesModule } from './fees/fees.module.js';
import { FeeBillingModule } from './fee-billing/fee-billing.module.js';
import { HrModule } from './hr/hr.module.js';
import { TransportModule } from './transport/transport.module.js';
import { HostelModule } from './hostel/hostel.module.js';
import { LibraryModule } from './library/library.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { TimetableModule } from './timetable/timetable.module.js';
import { IemisModule } from './iemis/iemis.module.js';
import { ReportCardsModule } from './report-cards/report-cards.module.js';
import { SmsModule } from './sms/sms.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { EnrollmentsModule } from './enrollments/enrollments.module.js';
import { TransferCertificatesModule } from './transfer-certificates/transfer-certificates.module.js';
import { CommonModule } from './common/common.module.js';
import { AccountThrottlerGuard } from './common/guards/account-throttler.guard.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { AuthorizationGuard } from './auth/guards/authorization.guard.js';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL') ?? 60_000,
          limit: config.get<number>('THROTTLE_LIMIT') ?? 300,
        },
      ],
    }),
    PrismaModule,
    CommonModule,
    PlatformModule,
    AuthModule,
    SubscriptionsModule,
    OrganizationsModule,
    TenantsModule,
    TenantRbacModule,
    BillingModule,
    AcademicsModule,
    StudentsModule,
    EnrollmentsModule,
    TransferCertificatesModule,
    ExaminationsModule,
    ExamsModule,
    FeesModule,
    FeeBillingModule,
    HrModule,
    TransportModule,
    HostelModule,
    LibraryModule,
    NotificationsModule,
    AttendanceModule,
    TimetableModule,
    IemisModule,
    ReportCardsModule,
    SmsModule,
    AnalyticsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AccountThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
})
export class AppModule {}
