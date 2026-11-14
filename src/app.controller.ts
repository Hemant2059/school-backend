import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './auth/decorators/public.decorator.js';
import { PrismaService } from './prisma.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Liveness and readiness probe.
   *
   * It reports whether the database is reachable, because an API that
   * cannot reach its database is not actually ready to serve traffic.
   */
  @Public()
  @Get('health')
  async health() {
    const startedAt = Date.now();
    let database = 'up';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }
    const healthy = database === 'up';
    if (!healthy) {
      throw new ServiceUnavailableException({
        status: 'degraded',
        database,
        uptimeSeconds: Math.round(process.uptime()),
      });
    }
    return {
      status: 'ok',
      database,
      uptimeSeconds: Math.round(process.uptime()),
      responseTimeMs: Date.now() - startedAt,
    };
  }
}
