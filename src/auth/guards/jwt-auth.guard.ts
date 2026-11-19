import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyService } from '../../integrations/services/api-key.service.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Authentication gate.
 *
 * Two credential types are accepted:
 *   1. A signed JWT in `Authorization: Bearer …` (the interactive app).
 *   2. A tenant API key in `x-api-key: sk_…` (integrations — read-only).
 *
 * API-key principals are attached to the request like any other tenant
 * principal, so the authorization guard enforces the same tenant pinning;
 * here we only decide *who* is calling and that the method is allowed.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly apiKeys?: ApiKeyService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);
    if (apiKey) {
      return this.authenticateApiKey(request, apiKey);
    }

    return (await super.canActivate(context)) as boolean;
  }

  private extractApiKey(request: any): string | null {
    const header: string | undefined = request.headers?.['x-api-key'];
    if (header?.trim()) return header.trim();
    // Accept `Authorization: Api-Key sk_…` as well for clients that only
    // support a single credential header.
    const auth: string | undefined = request.headers?.authorization;
    if (auth?.startsWith('Api-Key ')) return auth.slice('Api-Key '.length).trim();
    return null;
  }

  private async authenticateApiKey(
    request: any,
    rawKey: string,
  ): Promise<boolean> {
    if (!this.apiKeys) {
      throw new UnauthorizedException('API key authentication is not enabled');
    }
    // Keys are read-only — refused before authorization for clarity.
    const method = (request.method ?? 'GET').toUpperCase();
    if (!READ_METHODS.has(method)) {
      throw new ForbiddenException('API keys are read-only');
    }
    const principal = await this.apiKeys.authenticate(rawKey);
    if (!principal) {
      throw new UnauthorizedException('Invalid or revoked API key');
    }
    request.user = principal;
    return true;
  }
}
