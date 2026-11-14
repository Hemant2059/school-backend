import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { describe, expect, it } from 'vitest';
import { BooleanParam } from './boolean-param.decorator.js';

class QueryDto {
  @BooleanParam()
  includeDeleted?: boolean;

  @BooleanParam()
  isRead?: boolean;
}

describe('BooleanParam', () => {
  const transform = (input: Record<string, unknown>) =>
    plainToInstance(QueryDto, input, { enableImplicitConversion: true });

  it('parses the string "false" as false', () => {
    // Without this decorator, class-transformer's implicit conversion uses
    // Boolean(value), so "false" became true and every boolean filter was
    // inverted.
    expect(transform({ includeDeleted: 'false' }).includeDeleted).toBe(false);
  });

  it('parses the string "true" as true', () => {
    expect(transform({ includeDeleted: 'true' }).includeDeleted).toBe(true);
  });

  it('parses a real boolean', () => {
    expect(transform({ isRead: false }).isRead).toBe(false);
    expect(transform({ isRead: true }).isRead).toBe(true);
  });

  it('accepts the usual truthy and falsy spellings', () => {
    expect(transform({ isRead: '1' }).isRead).toBe(true);
    expect(transform({ isRead: '0' }).isRead).toBe(false);
    expect(transform({ isRead: 'yes' }).isRead).toBe(true);
    expect(transform({ isRead: 'no' }).isRead).toBe(false);
    expect(transform({ isRead: 'on' }).isRead).toBe(true);
    expect(transform({ isRead: 'off' }).isRead).toBe(false);
  });

  it('leaves an absent value undefined', () => {
    expect(transform({}).includeDeleted).toBeUndefined();
  });
});
