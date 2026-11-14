import { buildMeta, resolvePagination, type PaginatedResult, type PaginationInput } from './pagination.js';

/**
 * A minimal Prisma delegate shape, so this helper works with any model.
 *
 * The Prisma delegates are generic over their argument types, so the
 * structural type has to stay loose here; the caller still gets a typed
 * result through the explicit type parameter.
 */
export interface PaginatedDelegate {
  findMany(args: any): Promise<any[]>;
  count(args: any): Promise<number>;
}

export interface PaginatedArgs {
  where?: unknown;
  orderBy?: unknown;
  include?: unknown;
  select?: unknown;
}

/**
 * Runs a paginated list query.
 *
 * 59 of the 64 list endpoints in this codebase had no `take` at all, so
 * `GET /students` returned the entire school in one response - every row,
 * every column, including government identifiers.
 */
export async function paginatedQuery<T = any>(
  delegate: PaginatedDelegate,
  args: PaginatedArgs,
  query: PaginationInput | undefined,
): Promise<PaginatedResult<T>> {
  const { page, limit, skip, take } = resolvePagination(query);
  const [data, total] = await Promise.all([
    delegate.findMany({ ...args, skip, take }) as Promise<T[]>,
    delegate.count({ where: args.where }),
  ]);
  return { data, meta: buildMeta(total, page, limit) };
}
