import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentGatewayService } from './payment-gateway.service.js';
import type { ResolvedGatewayConfig } from './providers/resolved-config.js';

function makePrisma() {
  return {
    feeInvoice: {
      findFirst: vi.fn(),
    },
    paymentIntent: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(async () => []),
      count: vi.fn(async () => 0),
    },
  } as any;
}

function makeEngine() {
  return {
    recordPayment: vi.fn(async () => ({
      id: 'receipt-1',
      receiptNumber: 'RCP-00099',
    })),
  } as any;
}

function makeConfig(): any {
  return {
    get: (key: string) =>
      key === 'PUBLIC_API_BASE_URL' ? 'http://localhost:3000' : undefined,
  };
}

function tenantGatewaysMock() {
  return {
    resolveForTenant: vi.fn(),
    envStatus: vi.fn(() => ({ default: 'DEMO', gateways: [] })),
  } as any;
}

const unpaidInvoice = {
  id: 'invoice-1',
  tenantId: 't1',
  fiscalYearId: 'fy1',
  enrollmentId: 'enr1',
  invoiceNumber: 'INV-00001',
  balanceDue: 93500,
  status: 'PARTIALLY_PAID',
  enrollment: { student: { firstNameEn: 'Ram', lastNameEn: 'Sharma' } },
};

const demoResolved: ResolvedGatewayConfig = {
  gateway: 'DEMO',
  environment: 'sandbox',
};
const esewaResolved: ResolvedGatewayConfig = {
  gateway: 'ESEWA',
  environment: 'sandbox',
  merchantId: 'SCHOOL1974',
  secretKey: 'school-secret-key-1974abcd',
};

describe('PaymentGatewayService', () => {
  let prisma: any;
  let engine: any;
  let tenantGateways: any;
  let service: PaymentGatewayService;

  beforeEach(() => {
    prisma = makePrisma();
    engine = makeEngine();
    tenantGateways = tenantGatewaysMock();
    service = new PaymentGatewayService(
      prisma,
      engine,
      makeConfig(),
      tenantGateways,
    );

    prisma.feeInvoice.findFirst.mockResolvedValue(unpaidInvoice);
    prisma.paymentIntent.create.mockImplementation(async ({ data }: any) => ({
      id: 'intent-1',
      ...data,
    }));
    prisma.paymentIntent.update.mockResolvedValue({});
    prisma.paymentIntent.findFirst.mockResolvedValue(null);
  });

  describe('initiate', () => {
    it('rejects an unknown gateway before touching the database', async () => {
      await expect(
        service.initiate('t1', {
          invoiceId: 'invoice-1',
          gateway: 'PAYPAL' as any,
          paymentDateBs: '2082-08-04',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.feeInvoice.findFirst).not.toHaveBeenCalled();
    });

    it('rejects when the gateway is not configured for the school (no intent created)', async () => {
      tenantGateways.resolveForTenant.mockResolvedValue(null);
      await expect(
        service.initiate('t1', {
          invoiceId: 'invoice-1',
          gateway: 'ESEWA',
          paymentDateBs: '2082-08-04',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.paymentIntent.create).not.toHaveBeenCalled();
    });

    it('creates a DEMO intent with the invoice balance and returns the checkout hint', async () => {
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      const result = await service.initiate('t1', {
        invoiceId: 'invoice-1',
        paymentDateBs: '2082-08-04',
      });
      expect(result.gateway).toBe('DEMO');
      expect(result.amount).toBe(93500);
      expect(result.intentId).toBe('intent-1');
      expect(String((result as any).checkoutUrl)).toContain('intent=intent-1');
      expect(prisma.paymentIntent.create).toHaveBeenCalledTimes(1);
      expect(prisma.paymentIntent.create.mock.calls[0][0].data.gateway).toBe(
        'DEMO',
      );
    });

    it('passes the tenant eSewa credentials through to the form payload', async () => {
      tenantGateways.resolveForTenant.mockResolvedValue(esewaResolved);
      const result = await service.initiate('t1', {
        invoiceId: 'invoice-1',
        gateway: 'ESEWA',
        paymentDateBs: '2082-08-04',
      });
      const fields = (result as any).fields;
      expect(fields.product_code).toBe('SCHOOL1974');
    });

    it('rejects when the invoice is fully paid', async () => {
      prisma.feeInvoice.findFirst.mockResolvedValue({
        ...unpaidInvoice,
        status: 'PAID',
        balanceDue: 0,
      });
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      await expect(
        service.initiate('t1', {
          invoiceId: 'invoice-1',
          paymentDateBs: '2082-08-04',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects a missing invoice with 404', async () => {
      prisma.feeInvoice.findFirst.mockResolvedValue(null);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      await expect(
        service.initiate('t1', {
          invoiceId: 'nope',
          paymentDateBs: '2082-08-04',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('rejects a malformed paymentDateBs', async () => {
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      await expect(
        service.initiate('t1', {
          invoiceId: 'invoice-1',
          paymentDateBs: '2082-8-4',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('handleCallback / completeDemo settlement', () => {
    const demoIntent = {
      id: 'intent-1',
      tenantId: 't1',
      invoiceId: 'invoice-1',
      fiscalYearId: 'fy1',
      enrollmentId: 'enr1',
      gateway: 'DEMO' as const,
      status: 'PENDING',
      amount: 93500,
      gatewayRef: 'DEMO-ref-1',
      paymentDateBs: '2082-08-04',
    };

    it('settles a DEMO callback and records the receipt', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(demoIntent);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'DEMO-ref-1' },
      });
      expect(result.settled).toBe(true);
      expect(engine.recordPayment).toHaveBeenCalledTimes(1);
      const [, dto] = engine.recordPayment.mock.calls[0];
      expect(dto.amountPaid).toBe(93500);
      expect(dto.paymentMethod).toBe('DEMO');
      expect(dto.gatewayTransactionId).toBe('DEMO-ref-1');
      expect(prisma.paymentIntent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });

    it('unknown gateway reference settles nothing', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(null);
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'nope' },
      });
      expect(result.settled).toBe(false);
      expect(engine.recordPayment).not.toHaveBeenCalled();
    });

    it('amount mismatch marks the intent FAILED and records nothing', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(demoIntent);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      // Force a verification whose reported amount differs (tampered gateway).
      vi.spyOn(service as any, 'providerFor').mockReturnValue({
        verify: vi
          .fn()
          .mockResolvedValue({
            ok: true,
            gatewayRef: 'DEMO-ref-1',
            amount: 1,
            payload: {},
          }),
      });
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'DEMO-ref-1' },
      });
      expect(result.settled).toBe(false);
      expect(result.error).toMatch(/mismatch/i);
      expect(engine.recordPayment).not.toHaveBeenCalled();
      expect(prisma.paymentIntent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
    });

    it('gateway decline (authentic payload) marks the intent FAILED but records nothing', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(demoIntent);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      const result = await service.completeDemo('intent-1', true);
      expect(result.settled).toBe(false);
      expect(engine.recordPayment).not.toHaveBeenCalled();
      expect(prisma.paymentIntent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'FAILED' }),
        }),
      );
    });

    it('a verification without an authentic payload leaves the intent PENDING', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(demoIntent);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      vi.spyOn(service as any, 'providerFor').mockReturnValue({
        verify: vi
          .fn()
          .mockResolvedValue({
            ok: false,
            gatewayRef: 'DEMO-ref-1',
            error: 'weird',
          }),
      });
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'DEMO-ref-1' },
      });
      expect(result.settled).toBe(false);
      // FAILED must NOT be set (attacker cannot fail arbitrary intents with forged callbacks)
      const failedCalls = prisma.paymentIntent.update.mock.calls.filter(
        ([arg]: any[]) => arg?.data?.status === 'FAILED',
      );
      expect(failedCalls).toHaveLength(0);
    });

    it('replay of a COMPLETED intent does not double-record', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue({
        ...demoIntent,
        status: 'COMPLETED',
      });
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'DEMO-ref-1' },
      });
      expect(result.alreadyRecorded).toBe(true);
      expect(engine.recordPayment).not.toHaveBeenCalled();
    });

    it('gateway retry after a recorded receipt settles as alreadyRecorded', async () => {
      prisma.paymentIntent.findFirst.mockResolvedValue(demoIntent);
      tenantGateways.resolveForTenant.mockResolvedValue(demoResolved);
      engine.recordPayment.mockRejectedValue(
        new ConflictException('duplicate gateway transaction'),
      );
      const result = await service.handleCallback('DEMO', {
        query: { intent: 'DEMO-ref-1' },
      });
      expect(result.alreadyRecorded).toBe(true);
      expect(prisma.paymentIntent.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });
  });
});
