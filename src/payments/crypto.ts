import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * AES-256-GCM encryption for tenant gateway secrets.
 *
 * Gateway credentials belong to each school and live only in the database
 * (encrypted here before they touch it). The master key is NOT a gateway
 * credential and never appears in committed configuration. Resolution
 * order:
 *
 *   1. PAYMENT_CONFIG_MASTER_KEY env var (base64, 32 bytes) — for
 *      advanced deployments that inject secrets via their platform
 *      (Kubernetes envFrom, etc.). Never committed.
 *   2. A key file at PAYMENT_CONFIG_MASTER_KEY_FILE or the default
 *      /run/secrets/payment_master_key — the docker-compose file mounts
 *      the gitignored ./.local-secrets/ directory here.
 *   3. The first boot without a key auto-generates one into that file,
 *      so a fresh checkout works out of the box.
 *   4. Otherwise an ephemeral in-memory key is used (encryption works
 *      for the process lifetime; previously written rows become
 *      unreadable and a loud warning is logged).
 *
 * Ciphertext format: `v1.<iv>.<tag>.<ct>` (base64 parts). The version
 * prefix leaves room for key rotation without breaking existing rows.
 *
 * Nothing in this module logs or returns plaintext secrets.
 */

const VERSION = 'v1';
const DEFAULT_KEY_FILE = '/run/secrets/payment_master_key';
const EPHEMERAL_WARNING =
  'PAYMENT_CONFIG_MASTER_KEY is not configured and no key file could be read or created. ' +
  'Using an ephemeral in-memory key: credentials encrypted now will be unreadable after restart. ' +
  'Set PAYMENT_CONFIG_MASTER_KEY (openssl rand -base64 32) or mount /run/secrets/payment_master_key.';

export class PaymentSecretCryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentSecretCryptoError';
  }
}

/** Parse and validate a base64 32-byte key. Throws on invalid input. */
function parseKey(raw: string, source: string): Buffer {
  let key: Buffer;
  try {
    key = Buffer.from(raw.trim(), 'base64');
  } catch {
    throw new PaymentSecretCryptoError(`${source} is not valid base64`);
  }
  if (key.length !== 32) {
    throw new PaymentSecretCryptoError(
      `${source} must decode to 32 bytes, got ${key.length} (openssl rand -base64 32)`,
    );
  }
  return key;
}

function readKeyFile(path: string): Buffer | null {
  try {
    if (!existsSync(path)) return null;
    return parseKey(readFileSync(path, 'utf8'), path);
  } catch (error) {
    if (error instanceof PaymentSecretCryptoError) throw error;
    return null; // unreadable — fall through to bootstrap/ephemeral
  }
}

function writeKeyFile(path: string): Buffer | null {
  try {
    const key = randomBytes(32);
    writeFileSync(path, key.toString('base64') + '\n', {
      mode: 0o600,
      flag: 'wx',
    });
    // eslint-disable-next-line no-console
    console.warn(
      `[payments] generated a new master key at ${path} — keep this file safe`,
    );
    return key;
  } catch {
    return null; // exists but unreadable, or directory missing — fall through
  }
}

function bootstrapKeyFile(): Buffer | null {
  const candidates = [
    '/run/secrets/payment_master_key',
    join(process.cwd(), '.local-secrets', 'payment_master_key'),
  ];
  for (const path of candidates) {
    try {
      if (existsSync(path)) return readKeyFile(path);
    } catch {
      // keep looking
    }
  }
  for (const path of candidates) {
    try {
      const dir = path.slice(0, path.lastIndexOf('/'));
      mkdirSync(dir, { recursive: true });
      const key = writeKeyFile(path);
      if (key) return key;
    } catch {
      // keep looking
    }
  }
  return null;
}

let cachedKey: Buffer | null = null;
let warnedEphemeral = false;

function masterKey(): Buffer {
  if (cachedKey) return cachedKey;

  // 1) Explicit env var — supported, never committed anywhere.
  const rawEnv = process.env.PAYMENT_CONFIG_MASTER_KEY;
  if (rawEnv) {
    cachedKey = parseKey(rawEnv, 'PAYMENT_CONFIG_MASTER_KEY');
    return cachedKey;
  }

  // 2) File at the well-known path (compose mounts ./.local-secrets here),
  //    or the development fallback next to the app.
  const filePath =
    process.env.PAYMENT_CONFIG_MASTER_KEY_FILE ?? DEFAULT_KEY_FILE;
  const fromFile = readKeyFile(filePath);
  if (fromFile) {
    cachedKey = fromFile;
    return cachedKey;
  }

  // 3) First-boot bootstrap: generate and persist a key into a writable
  //    well-known location so fresh checkouts work out of the box.
  const bootstrapped = bootstrapKeyFile();
  if (bootstrapped) {
    cachedKey = bootstrapped;
    return cachedKey;
  }

  // 4) Ephemeral in-memory key with a loud warning.
  if (!warnedEphemeral) {
    // eslint-disable-next-line no-console
    console.warn(`[payments] ${EPHEMERAL_WARNING}`);
    warnedEphemeral = true;
  }
  cachedKey = randomBytes(32);
  return cachedKey;
}

/** Reset the cached key — test use only. */
export function resetMasterKeyCacheForTests(): void {
  cachedKey = null;
  warnedEphemeral = false;
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', masterKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `${VERSION}.${iv.toString('base64')}.${tag.toString('base64')}.${ciphertext.toString('base64')}`;
}

export function decryptSecret(stored: string): string {
  const parts = stored.split('.');
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new PaymentSecretCryptoError('Unrecognized encrypted secret format');
  }
  const [, ivB64, tagB64, ctB64] = parts;
  const decipher = createDecipheriv(
    'aes-256-gcm',
    masterKey(),
    Buffer.from(ivB64, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  try {
    return Buffer.concat([
      decipher.update(Buffer.from(ctB64, 'base64')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new PaymentSecretCryptoError(
      'Encrypted secret failed authentication — wrong key or corrupted data',
    );
  }
}

/** Constant-time comparison for fixed strings (not for secrets that differ in length). */
export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
}

/** Mask a secret for display: show at most the last 4 characters. */
export function maskSecret(secret: string | null | undefined): string | null {
  if (!secret) return null;
  if (secret.length <= 4) return '••••';
  return `••••${secret.slice(-4)}`;
}
