/**
 * Abstraction over SMS gateways (Sparrow, Namaste bulk SMS, …).
 *
 * The provider is selected by the SMS_PROVIDER env var; the default is a
 * no-op provider that only logs, so importing this feature never sends a
 * real SMS until the school explicitly configures one.
 */

export interface SmsResult {
  ok: boolean;
  provider: string;
  providerRef?: string;
  error?: string;
}

export interface SmsProvider {
  readonly name: string;
  send(to: string, message: string): Promise<SmsResult>;
}
