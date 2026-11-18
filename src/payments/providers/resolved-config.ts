import type { GatewayName } from './types.js';

/**
 * One school's effective gateway configuration — either the tenant's own
 * (decrypted from TenantPaymentGatewayConfig) or the platform-wide
 * fallback from the environment (used for the demo setup and for
 * single-school deployments).
 *
 * Produced only by PaymentGatewayService; providers receive it fully
 * resolved and never read the environment or the database themselves.
 */
export interface ResolvedGatewayConfig {
  gateway: GatewayName;
  /** 'sandbox' | 'production' */
  environment: string;
  /** eSewa product_code · ConnectIPS MERCHANTID */
  merchantId?: string;
  /** ConnectIPS APPID (distinct from MERCHANTID) */
  appId?: string;
  /** eSewa secret · Khalti live_secret_key · ConnectIPS APP password */
  secretKey?: string;
  /** ConnectIPS APPNAME (not secret) */
  appName?: string;
  /** ConnectIPS creditor private key (PEM content, decrypted) */
  privateKeyPem?: string;
  /** Optional gateway host override (proxies, internal UAT hosts) */
  baseUrl?: string;
}
