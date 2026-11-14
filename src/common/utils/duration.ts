/**
 * Converts a `jsonwebtoken`-style duration string ("15m", "7d", "2h") into
 * milliseconds, so that the expiry stored in the database always agrees with
 * the `exp` claim baked into the token.
 */
export function parseDurationMs(duration: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(duration.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  switch ((match[2] ?? 's').toLowerCase()) {
    case 'ms':
      return value;
    case 'm':
      return value * 60_000;
    case 'h':
      return value * 3_600_000;
    case 'd':
      return value * 86_400_000;
    default:
      return value * 1000;
  }
}
