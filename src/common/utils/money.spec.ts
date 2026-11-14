import { describe, expect, it } from 'vitest';
import { applyDiscount, money, multiply, subtract, sum, toDecimal } from './money.js';

describe('money helpers', () => {
  it('rounds to two decimal places, half up', () => {
    expect(money(10.005).toFixed(2)).toBe('10.01');
    expect(money('0.1').plus(money('0.2')).toFixed(2)).toBe('0.30');
  });

  it('avoids binary floating point drift', () => {
    // 0.1 + 0.2 !== 0.3 in IEEE-754
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(money(0.1).plus(money(0.2)).toFixed(2)).toBe('0.30');
  });

  it('sums a list of amounts', () => {
    expect(sum([100, 250.5, 0.25]).toFixed(2)).toBe('350.75');
  });

  it('subtracts and multiplies in decimal', () => {
    expect(subtract(1000, 250.55).toFixed(2)).toBe('749.45');
    expect(multiply(100, 0.1).toFixed(2)).toBe('10.00');
  });

  it('treats null and undefined as zero', () => {
    expect(toDecimal(null).toFixed(2)).toBe('0.00');
    expect(toDecimal(undefined).toFixed(2)).toBe('0.00');
  });

  describe('applyDiscount', () => {
    it('applies a percentage discount', () => {
      expect(applyDiscount(1000, 'PERCENTAGE', 10).toFixed(2)).toBe('900.00');
    });

    it('applies a flat discount', () => {
      expect(applyDiscount(1000, 'FLAT_AMOUNT', 250).toFixed(2)).toBe('750.00');
    });

    it('caps a percentage discount at 100%', () => {
      // A mis-entered 250% must not produce a negative amount.
      expect(applyDiscount(1000, 'PERCENTAGE', 250).toFixed(2)).toBe('0.00');
    });

    it('caps a flat discount at the gross amount', () => {
      expect(applyDiscount(1000, 'FLAT_AMOUNT', 5000).toFixed(2)).toBe('0.00');
    });

    it('ignores a zero or negative discount', () => {
      expect(applyDiscount(1000, 'PERCENTAGE', 0).toFixed(2)).toBe('1000.00');
      expect(applyDiscount(1000, 'FLAT_AMOUNT', -50).toFixed(2)).toBe('1000.00');
    });
  });
});
