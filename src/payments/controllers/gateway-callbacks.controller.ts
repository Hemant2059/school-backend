import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PaymentGatewayService } from '../payment-gateway.service.js';

class DemoCompleteDto {
  @IsUUID() intentId!: string;
  /** Set true to simulate the payer cancelling/declining. */
  @IsOptional() @IsBoolean() fail?: boolean;
}

/**
 * Gateway callbacks. These are @Public() — the gateways redirect the
 * payer's browser here and cannot present a tenant JWT. Every callback is
 * verified against the gateway itself (signature and/or server-to-server
 * lookup) before anything is recorded.
 */
@Controller('payments/gateways')
export class GatewayCallbacksController {
  constructor(private readonly service: PaymentGatewayService) {}

  /** Which gateways are usable right now (drives the pay buttons). */
  @Public()
  @Get()
  list() {
    return this.service.listGateways();
  }

  @Public()
  @Get('esewa')
  esewa(@Query() query: Record<string, string>) {
    return this.service.handleCallback('ESEWA', { query });
  }

  @Public()
  @Get('khalti')
  khalti(@Query() query: Record<string, string>) {
    return this.service.handleCallback('KHALTI', { query });
  }

  @Public()
  @Get('connectips')
  connectips(@Query() query: Record<string, string>) {
    return this.service.handleCallback('CONNECTIPS', { query });
  }

  /** eSewa failure redirect — treated as a failed (not authenticated) callback. */
  @Public()
  @Get('esewa/failure')
  esewaFailure(@Query() query: Record<string, string>) {
    return this.service.handleCallback('ESEWA', {
      query: { ...query, status: query.status ?? 'failure' },
    });
  }

  /**
   * Demo checkout — the "user pressed Pay" step of the demo gateway.
   * Available because the demo provider exists; with demo mode disabled it
   * simply 404s on the intent lookup.
   */
  @Public()
  @Post('demo/complete')
  demoComplete(@Body() dto: DemoCompleteDto) {
    return this.service.completeDemo(dto.intentId, dto.fail ?? false);
  }
}
