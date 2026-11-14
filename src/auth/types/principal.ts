/**
 * The authenticated principal attached to the request by the JWT strategy.
 *
 * `type` is the security boundary between the two RBAC domains: platform
 * principals are SaaS company staff, tenant principals belong to exactly one
 * school. The strategy already produced this discriminator — it was simply
 * never consumed, which is what allowed a school tenant to reach platform
 * administration endpoints.
 */
export interface AuthenticatedPrincipal {
  type: 'platform' | 'tenant';
  id: string;
  email: string | null;
  tenantId?: string;
  tenantUserId?: string;
  roles: string[];
  permissions: string[];
  firstNameEn?: string;
  lastNameEn?: string;
  status?: string;
  /**
   * The tenant's subscription status (TRIAL, ACTIVE, PAST_DUE, CANCELLED,
   * SUSPENDED, EXPIRED or NONE). Used to lock out a school whose
   * subscription has lapsed.
   */
  subscriptionStatus?: string;
}
