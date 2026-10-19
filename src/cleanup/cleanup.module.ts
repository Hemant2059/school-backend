import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma.module.js';
import { CleanupService } from './cleanup.service.js';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [CleanupService],
})
export class CleanupModule {}
