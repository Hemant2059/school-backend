import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
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
import { NotificationsModule } from './notifications/notifications.module.js';
import { CleanupModule } from './cleanup/cleanup.module.js';
import { EnrollmentsModule } from './enrollments/enrollments.module.js';
import { TransferCertificatesModule } from './transfer-certificates/transfer-certificates.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from './auth/guards/permissions.guard.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, PlatformModule, AuthModule, SubscriptionsModule, OrganizationsModule, TenantsModule, TenantRbacModule, BillingModule, AcademicsModule, StudentsModule, EnrollmentsModule, TransferCertificatesModule, ExaminationsModule, ExamsModule, FeesModule, FeeBillingModule, HrModule, TransportModule, HostelModule, NotificationsModule, CleanupModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
