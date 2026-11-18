import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  decryptSecret,
  encryptSecret,
  maskSecret,
  resetMasterKeyCacheForTests,
  PaymentSecretCryptoError,
} from './crypto.js';

const TEST_KEY = Buffer.alloc(32, 7).toString('base64');

describe('payment secret crypto', () => {
  beforeEach(() => {
    process.env.PAYMENT_CONFIG_MASTER_KEY = TEST_KEY;
    resetMasterKeyCacheForTests();
  });
  afterEach(() => {
    delete process.env.PAYMENT_CONFIG_MASTER_KEY;
    resetMasterKeyCacheForTests();
    vi.restoreAllMocks();
  });

  it('round-trips a secret', () => {
    const secret = 'school-secret-key-1974abcd';
    const stored = encryptSecret(secret);
    expect(stored).not.toContain(secret);
    expect(stored.startsWith('v1.')).toBe(true);
    expect(decryptSecret(stored)).toBe(secret);
  });

  it('produces different ciphertexts for the same plaintext (random IV)', () => {
    const a = encryptSecret('same-input');
    const b = encryptSecret('same-input');
    expect(a).not.toBe(b);
    expect(decryptSecret(a)).toBe('same-input');
    expect(decryptSecret(b)).toBe('same-input');
  });

  it('rejects a ciphertext encrypted with a different key', () => {
    const stored = encryptSecret('secret');
    process.env.PAYMENT_CONFIG_MASTER_KEY = Buffer.alloc(32, 9).toString(
      'base64',
    );
    resetMasterKeyCacheForTests();
    expect(() => decryptSecret(stored)).toThrow(PaymentSecretCryptoError);
  });

  it('rejects a tampered ciphertext', () => {
    const stored = encryptSecret('secret');
    const parts = stored.split('.');
    parts[3] = Buffer.from('forged').toString('base64');
    expect(() => decryptSecret(parts.join('.'))).toThrow(
      PaymentSecretCryptoError,
    );
  });

  it('rejects a malformed key with a clear message', () => {
    process.env.PAYMENT_CONFIG_MASTER_KEY = 'aGVsbG8='; // 5 bytes
    resetMasterKeyCacheForTests();
    expect(() => encryptSecret('x')).toThrow(/32 bytes/);
  });

  it('masks secrets to the last four characters', () => {
    expect(maskSecret('school-secret-key-1974abcd')).toBe('••••abcd');
    expect(maskSecret('abc')).toBe('••••');
    expect(maskSecret(null)).toBeNull();
    expect(maskSecret(undefined)).toBeNull();
    expect(maskSecret('')).toBeNull();
  });
});
