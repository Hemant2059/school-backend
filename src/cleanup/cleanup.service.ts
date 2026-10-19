import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 2 * * *') // daily at 02:00
  async purgeDeleted() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    try {
      const tenants = await this.prisma.tenant.deleteMany({
        where: { deletedAt: { not: null, lt: cutoff } },
      });
      const orgs = await this.prisma.organization.deleteMany({
        where: { deletedAt: { not: null, lt: cutoff } },
      });
      this.logger.log(`Purged ${tenants.count} tenants and ${orgs.count} organizations older than 7 days`);
    } catch (e) {
      this.logger.error('Purge failed', e);
    }
  }
}
