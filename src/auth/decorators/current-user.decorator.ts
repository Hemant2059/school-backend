import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedPrincipal } from '../types/principal.js';

/**
 * Injects the authenticated principal into a handler.
 *
 * Replaces the previous `@Req() req: any` pattern, which leaked the whole
 * Express request object (and gave handlers access to `req.user.id` without
 * any type safety).
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedPrincipal | undefined, ctx: ExecutionContext): AuthenticatedPrincipal | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedPrincipal;
    return data ? user?.[data] : user;
  },
);
