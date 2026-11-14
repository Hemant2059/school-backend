import { Transform } from 'class-transformer';

/**
 * Parses a boolean from a query string or JSON body.
 *
 * `enableImplicitConversion` converts with `Boolean(value)`, which turns the
 * string `"false"` into `true`. That silently inverted every boolean query
 * parameter in the API (`?includeDeleted=false` returned deleted rows,
 * `?isRead=false` returned read rows, `?isCurrent=false` returned current
 * rows).
 *
 * class-transformer applies `@Transform` *after* implicit conversion, so the
 * decorator reads the untouched raw value from the source object instead of
 * the already-converted one.
 */
export function BooleanParam(): PropertyDecorator {
  return Transform(({ obj, key, value }) => {
    const raw = obj && typeof key === 'string' && key in obj ? (obj as Record<string, unknown>)[key] : value;
    if (raw === undefined || raw === null) return raw;
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') return true;
      if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off' || normalized === '') {
        return false;
      }
      return true;
    }
    if (typeof raw === 'number') return raw !== 0;
    return Boolean(raw);
  }) as PropertyDecorator;
}
