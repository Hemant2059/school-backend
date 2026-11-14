import { Prisma } from '../../generated/prisma/client.js';

/**
 * Money helpers.
 *
 * Every monetary value in the database is a `Decimal(12,2)` (PostgreSQL
 * NUMERIC). The API, however, speaks JSON numbers. The previous code let the
 * client supply totals and never re-derived them, so `subtotalAmount`,
 * `netPayableAmount` and `balanceDue` could disagree with each other and
 * with the line items — and `0.1 + 0.2 !== 0.3` in IEEE-754.
 *
 * All arithmetic is therefore performed in decimal and rounded half-up to two
 * decimal places (the convention used for Nepali rupees).
 */

export type DecimalLike = Prisma.Decimal | number | string;

export function toDecimal(value: DecimalLike | null | undefined): Prisma.Decimal {
  if (value === null || value === undefined) return new Prisma.Decimal(0);
  if (value instanceof Prisma.Decimal) return value;
  return new Prisma.Decimal(value);
}

/** Rounds to 2 decimal places, half-up — the rounding used for NPR. */
export function money(value: DecimalLike): Prisma.Decimal {
  return toDecimal(value).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function sum(values: DecimalLike[]): Prisma.Decimal {
  return values.reduce<Prisma.Decimal>((acc, v) => acc.plus(toDecimal(v)), new Prisma.Decimal(0));
}

export function subtract(a: DecimalLike, b: DecimalLike): Prisma.Decimal {
  return toDecimal(a).minus(toDecimal(b));
}

export function multiply(a: DecimalLike, b: DecimalLike): Prisma.Decimal {
  return toDecimal(a).times(toDecimal(b));
}

/**
 * Applies a scholarship discount to a gross amount.
 *
 * `PERCENTAGE` discounts are expressed in percent and are capped at 100% so a
 * mis-entered 250% cannot produce a negative invoice line. `FLAT_AMOUNT`
 * discounts are capped at the gross amount for the same reason.
 */
export function applyDiscount(
  gross: DecimalLike,
  discountType: 'PERCENTAGE' | 'FLAT_AMOUNT',
  discountValue: DecimalLike,
): Prisma.Decimal {
  const g = toDecimal(gross);
  const value = toDecimal(discountValue);
  if (value.lte(0)) return money(g);

  if (discountType === 'PERCENTAGE') {
    const pct = value.greaterThan(100) ? new Prisma.Decimal(100) : value;
    return money(g.minus(multiply(g, pct.div(100))));
  }
  const flat = value.greaterThan(g) ? g : value;
  return money(g.minus(flat));
}

export function isZero(value: DecimalLike): boolean {
  return toDecimal(value).isZero();
}

export function isNegative(value: DecimalLike): boolean {
  return toDecimal(value).isNegative();
}

export function greaterThan(a: DecimalLike, b: DecimalLike): boolean {
  return toDecimal(a).greaterThan(toDecimal(b));
}

export function lessThanOrEqual(a: DecimalLike, b: DecimalLike): boolean {
  return toDecimal(a).lessThanOrEqualTo(toDecimal(b));
}

export function equals(a: DecimalLike, b: DecimalLike): boolean {
  return toDecimal(a).equals(toDecimal(b));
}
