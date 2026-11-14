export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

/**
 * The pagination parameters of a request.
 *
 * Deliberately loose: query DTOs carry more than just `page` and `limit`,
 * and TypeScript's weak-type check rejects a type with no properties in
 * common with an all-optional interface.
 */
export type PaginationInput = {
  page?: number | string;
  limit?: number | string;
};

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Normalises pagination input.
 *
 * The limit is always clamped, so a client cannot ask for the entire table
 * in one response by passing `limit=1000000`.
 */
export function resolvePagination(
  // `unknown` rather than a DTO type: a query DTO is a class, so it has no
  // implicit index signature and would fail the weak-type check.
  input: unknown,
  options: PaginationOptions = {},
): { page: number; limit: number; skip: number; take: number } {
  const source = (input ?? {}) as PaginationInput & Record<string, unknown>;
  const defaultLimit = options.defaultLimit ?? 20;
  const maxLimit = options.maxLimit ?? 100;

  const rawPage = Number(source['page'] ?? 1);
  const rawLimit = Number(source['limit'] ?? defaultLimit);

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit >= 1
    ? Math.min(Math.floor(rawLimit), maxLimit)
    : defaultLimit;

  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function buildMeta(total: number, page: number, limit: number): PaginatedMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && total > 0,
  };
}
