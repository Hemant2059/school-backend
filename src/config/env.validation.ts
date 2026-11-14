/**
 * Fail-fast environment validation.
 *
 * The previous implementation fell back to hard-coded development secrets
 * (`'dev-access-secret'`, `'dev-refresh-secret'`) whenever `JWT_SECRET` /
 * `JWT_REFRESH_SECRET` were missing. That made a misconfigured deployment
 * silently forgeable, so we now refuse to boot instead.
 */

export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGINS?: string;
  SWAGGER_ENABLED?: string;
  THROTTLE_TTL?: number;
  THROTTLE_LIMIT?: number;
}

const DEV_ONLY_SECRET_PATTERN = /dev-access-secret|dev-refresh-secret|change-me|changeme/i;

class EnvValidationError extends Error {
  constructor(problems: string[]) {
    super(`Invalid environment configuration:\n  - ${problems.join('\n  - ')}`);
    this.name = 'EnvValidationError';
  }
}

function requireString(raw: Record<string, unknown>, key: string, problems: string[]): string {
  const value = raw[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    problems.push(`${key} is required and must be a non-empty string`);
    return '';
  }
  return value.trim();
}

export function validateEnv(raw: Record<string, unknown>): AppEnv {
  const problems: string[] = [];
  const nodeEnv = (raw.NODE_ENV ?? 'development').toString();
  const isProduction = nodeEnv === 'production';

  const databaseUrl = requireString(raw, 'DATABASE_URL', problems);
  if (databaseUrl && !/^postgres(ql)?:\/\//i.test(databaseUrl)) {
    problems.push('DATABASE_URL must be a postgres:// or postgresql:// connection string');
  }

  const jwtSecret = requireString(raw, 'JWT_SECRET', problems);
  const jwtRefreshSecret = requireString(raw, 'JWT_REFRESH_SECRET', problems);

  for (const [key, value] of [
    ['JWT_SECRET', jwtSecret],
    ['JWT_REFRESH_SECRET', jwtRefreshSecret],
  ] as const) {
    if (!value) continue;
    if (value.length < 32) {
      problems.push(`${key} must be at least 32 characters long`);
    }
    if (DEV_ONLY_SECRET_PATTERN.test(value)) {
      problems.push(`${key} still uses a well-known development placeholder value`);
    }
  }

  if (jwtSecret && jwtRefreshSecret && jwtSecret === jwtRefreshSecret) {
    problems.push('JWT_SECRET and JWT_REFRESH_SECRET must be different values');
  }

  const port = Number(raw.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    problems.push('PORT must be an integer between 1 and 65535');
  }

  if (problems.length > 0) {
    throw new EnvValidationError(problems);
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_EXPIRES_IN: (raw.JWT_EXPIRES_IN ?? '15m').toString(),
    JWT_REFRESH_EXPIRES_IN: (raw.JWT_REFRESH_EXPIRES_IN ?? '7d').toString(),
    CORS_ORIGINS: raw.CORS_ORIGINS?.toString(),
    SWAGGER_ENABLED: raw.SWAGGER_ENABLED?.toString(),
    THROTTLE_TTL: Number(raw.THROTTLE_TTL ?? 60000),
    THROTTLE_LIMIT: Number(raw.THROTTLE_LIMIT ?? 100),
    ...(isProduction ? {} : {}),
  };
}
