/**
 * Abstraction over the online payment gateways used by Nepali schools.
 *
 * A provider knows how to (a) build the initiation payload the browser
 * needs to reach the gateway and (b) verify a callback against the
 * gateway itself. Verification is always server-to-server or signature
 * based — a callback is never trusted on its own word.
 */

export type GatewayName = 'DEMO' | 'ESEWA' | 'KHALTI' | 'CONNECTIPS';

export interface InitiateInput {
  /** Opaque id of the PaymentIntent row. */
  intentId: string;
  /** Amount in NPR with 2 decimals. */
  amount: number;
  invoiceNumber?: string | null;
  /** Callback override; defaults to PUBLIC_API_BASE_URL. */
  callbackBaseUrl?: string;
  payer?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}

export interface ProviderInitiation {
  gatewayRef: string;
  /** Redirect URL, form fields, or a demo checkout hint for the client. */
  payload: Record<string, unknown>;
}

export interface VerifyInput {
  intent: {
    id: string;
    amount: number;
    gatewayRef: string | null;
    paymentDateBs: string;
  };
  /** Raw gateway callback parameters (query string for GET callbacks, or JSON). */
  raw: { query?: Record<string, string>; body?: Record<string, unknown> };
}

export interface ProviderVerification {
  ok: boolean;
  gatewayRef: string;
  /** Amount confirmed by the gateway, in NPR (2 decimals). */
  amount?: number;
  /** Raw callback payload, stored for audit. */
  payload?: Record<string, unknown>;
  error?: string;
}

export interface PaymentGatewayProvider {
  readonly gateway: GatewayName;
  initiate(input: InitiateInput): Promise<ProviderInitiation>;
  verify(input: VerifyInput): Promise<ProviderVerification>;
}
