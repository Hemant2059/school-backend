import { describe, expect, it } from 'vitest';
import { buildMeta, resolvePagination } from './pagination.js';

describe('pagination', () => {
  it('defaults to the first page', () => {
    expect(resolvePagination(undefined)).toEqual({ page: 1, limit: 20, skip: 0, take: 20 });
  });

  it('clamps the limit so a client cannot fetch the whole table', () => {
    const result = resolvePagination({ page: 1, limit: 1000000 });
    expect(result.limit).toBe(100);
    expect(result.take).toBe(100);
  });

  it('rejects a non-positive page', () => {
    expect(resolvePagination({ page: 0, limit: 10 }).page).toBe(1);
    expect(resolvePagination({ page: -5, limit: 10 }).page).toBe(1);
  });

  it('rejects a non-positive limit', () => {
    expect(resolvePagination({ page: 1, limit: 0 }).limit).toBe(20);
  });

  it('computes the offset', () => {
    expect(resolvePagination({ page: 3, limit: 25 })).toEqual({
      page: 3,
      limit: 25,
      skip: 50,
      take: 25,
    });
  });

  it('reports the navigation flags', () => {
    expect(buildMeta(100, 1, 20)).toMatchObject({
      total: 100,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    });
    expect(buildMeta(100, 3, 20)).toMatchObject({
      hasNextPage: true,
      hasPreviousPage: true,
    });
    expect(buildMeta(100, 5, 20)).toMatchObject({ hasNextPage: false });
  });

  it('reports zero pages for an empty result', () => {
    expect(buildMeta(0, 1, 20).totalPages).toBe(0);
  });
});
