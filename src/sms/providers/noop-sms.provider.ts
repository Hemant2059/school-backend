import { Injectable, Logger } from '@nestjs/common';
import type { SmsProvider, SmsResult } from '../sms-provider.js';

/**
 * Default provider: logs the outbound message and reports success.
 * Used until the school configures a real gateway — nothing ever leaves
 * the machine.
 */
@Injectable()
export class NoopSmsProvider implements SmsProvider {
  readonly name = 'noop';
  private readonly logger = new Logger('NoopSmsProvider');

  async send(to: string, message: string): Promise<SmsResult> {
    this.logger.log(
      `SMS (not sent — no gateway configured) to ${to}: ${message.slice(0, 120)}`,
    );
    return { ok: true, provider: this.name, providerRef: 'noop' };
  }
}
