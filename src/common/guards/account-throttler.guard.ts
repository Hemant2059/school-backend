import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Rate limiting keyed by the account being targeted, not only by IP.
 *
 * A school office shares one NAT address, so a pure IP limit of thirty
 * logins a minute meant that one member of staff signing in locked out
 * everyone else in the building. Keying the login limit by the email address
 * gives the protection that matters — an attacker hammering one account —
 * without penalising a shared address.
 *
 * Requests without an email in the body (everything that is not a login)
 * fall back to the IP address.
 */
@Injectable()
export class AccountThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const email = req?.body?.email;
    if (typeof email === 'string' && email.trim().length > 0) {
      return `account:${email.trim().toLowerCase()}`;
    }
    return `ip:${req?.ip ?? 'unknown'}`;
  }
}
