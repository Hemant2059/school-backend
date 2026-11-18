import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaymentGatewayService } from '../payment-gateway.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { OnlinePaymentGateway } from '../../generated/prisma/client.js';

class CreatePaymentIntentDto {
  @IsUUID() invoiceId!: string;
  @IsOptional() @IsEnum(OnlinePaymentGateway) gateway?: OnlinePaymentGateway;
  /** Client-supplied BS calendar date for the receipt (YYYY-MM-DD). */
  @IsString() @MinLength(4) @MaxLength(10) paymentDateBs!: string;
}

@Controller('tenants/:tenantId/payment-intents')
export class PaymentIntentsController {
  constructor(private readonly service: PaymentGatewayService) {}

  /**
   * Initiates an online payment against a fee invoice.
   * The response contains everything the client needs to reach the gateway
   * (redirect URL / signed form fields / demo checkout hint).
   */
  @Permissions('fee_payments.manage')
  @Post()
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.service.initiate(tenantId, {
      invoiceId: dto.invoiceId,
      gateway: dto.gateway as any,
      paymentDateBs: dto.paymentDateBs,
    });
  }

  /** Lists payment intents (management visibility into attempts). */
  @Permissions('fee_payments.read')
  @Get()
  findAll(
    @Param('tenantId') tenantId: string,
    @Query() query: Record<string, any>,
  ) {
    return this.service.listIntents(tenantId, query);
  }

  /** Status of one intent — the client polls until COMPLETED. */
  @Permissions('fee_payments.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.getIntent(tenantId, id);
  }
}
