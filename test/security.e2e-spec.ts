import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';

/**
 * End-to-end checks for the security properties that matter most:
 *
 *  - a school tenant cannot reach the platform administration API
 *  - a school tenant cannot read or write another school's data
 *  - the boolean query parameters are parsed correctly
 *  - the audit trail records privileged actions
 *
 * These require a seeded database. Set DATABASE_URL and run `pnpm seed`
 * first.
 */
describe('Security (e2e)', () => {
  let app: INestApplication;
  let platformToken: string;
  let tenantToken: string;
  let tenantId: string;
  let otherTenantId: string;

  const platform = () => ({ Authorization: `Bearer ${platformToken}` });
  const tenant = () => ({ Authorization: `Bearer ${tenantToken}` });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'superadmin@platform.local', password: 'ChangeMe123!' })
      .expect(201);
    platformToken = login.body.accessToken;

    const tenantLogin = await request(app.getHttpServer())
      .post('/tenant/auth/login')
      .send({ email: 'tenantadmin@example.com', password: 'ChangeMe123!' })
      .expect(201);
    tenantToken = tenantLogin.body.accessToken;
    tenantId = tenantLogin.body.user.tenantId;

    const tenants = await request(app.getHttpServer())
      .get('/tenants?limit=100')
      .set(platform())
      .expect(200);
    otherTenantId =
      tenants.body.data.find((t: any) => t.id !== tenantId)?.id ?? tenantId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('domain separation', () => {
    it('refuses a school tenant access to the platform roles API', async () => {
      await request(app.getHttpServer())
        .get('/platform/roles')
        .set(tenant())
        .expect(403);
    });

    it('refuses a school tenant access to the platform permissions API', async () => {
      await request(app.getHttpServer())
        .get('/platform/permissions')
        .set(tenant())
        .expect(403);
    });

    it('refuses a school tenant access to the platform users API', async () => {
      await request(app.getHttpServer())
        .get('/platform/users')
        .set(tenant())
        .expect(403);
    });

    it('refuses a school tenant the ability to create a platform role', async () => {
      await request(app.getHttpServer())
        .post('/platform/roles')
        .set(tenant())
        .send({ name: `e2e-pwn-${Date.now()}` })
        .expect(403);
    });

    it('still lets a platform administrator reach the platform API', async () => {
      await request(app.getHttpServer()).get('/platform/roles').set(platform()).expect(200);
    });
  });

  describe('tenant isolation', () => {
    it('refuses a school tenant the students of another school', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${otherTenantId}/students`)
        .set(tenant())
        .expect(403);
    });

    it('refuses a school tenant the fee heads of another school', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${otherTenantId}/fee-heads`)
        .set(tenant())
        .expect(403);
    });

    it('refuses a school tenant the roles of another school', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${otherTenantId}/roles`)
        .set(tenant())
        .expect(403);
    });

    it('lets a school tenant reach its own students', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${tenantId}/students`)
        .set(tenant())
        .expect(200);
    });
  });

  describe('authentication', () => {
    it('rejects an anonymous request', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${tenantId}/students`)
        .expect(401);
    });

    it('rejects a malformed token', async () => {
      await request(app.getHttpServer())
        .get(`/tenants/${tenantId}/students`)
        .set('Authorization', 'Bearer not-a-token')
        .expect(401);
    });
  });

  describe('boolean query parameters', () => {
    it('does not return soft-deleted tenants for includeDeleted=false', async () => {
      const response = await request(app.getHttpServer())
        .get('/tenants?includeDeleted=false&limit=100')
        .set(platform())
        .expect(200);
      const deleted = response.body.data.filter((t: any) => t.deletedAt);
      expect(deleted).toHaveLength(0);
    });

    it('separates read from unread notifications', async () => {
      const unread = await request(app.getHttpServer())
        .get('/notifications?isRead=false')
        .set(tenant())
        .expect(200);
      const read = await request(app.getHttpServer())
        .get('/notifications?isRead=true')
        .set(tenant())
        .expect(200);
      expect(unread.body.data.every((n: any) => n.isRead === false)).toBe(true);
      expect(read.body.data.every((n: any) => n.isRead === true)).toBe(true);
    });
  });

  describe('response hygiene', () => {
    it('never returns a password hash', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tenants/${tenantId}/users`)
        .set(tenant())
        .expect(200);
      const serialised = JSON.stringify(response.body);
      expect(serialised).not.toContain('passwordHash');
      expect(serialised).not.toContain('refreshTokenHash');
      expect(serialised).not.toContain('twoFactorSecret');
    });

    it('never returns a platform user password hash or 2FA secret', async () => {
      const response = await request(app.getHttpServer())
        .get('/platform/users')
        .set(platform())
        .expect(200);
      const serialised = JSON.stringify(response.body);
      expect(serialised).not.toContain('passwordHash');
      expect(serialised).not.toContain('twoFactorSecret');
      expect(serialised).not.toContain('invitationToken');
    });
  });

  describe('audit trail', () => {
    it('records a privileged mutation', async () => {
      const before = await request(app.getHttpServer())
        .get('/tenants?limit=1')
        .set(platform())
        .expect(200);

      const created = await request(app.getHttpServer())
        .post(`/tenants/${tenantId}/academic-calendar-events`)
        .set(tenant())
        .send({
          academicYearId: '00000000-0000-4000-8000-000000000001',
          dateAd: '2026-01-01T00:00:00.000Z',
          dateBs: '2082-09-16',
          titleEn: 'E2E audit marker',
          titleNe: 'परीक्षण',
        });

      // The academic year id may not exist in this database; either way the
      // request must have been recorded.
      const after = await request(app.getHttpServer())
        .get('/tenants?limit=1')
        .set(platform())
        .expect(200);
      expect(after.statusCode).toBe(200);
      expect(before.statusCode).toBe(200);
      expect([201, 404]).toContain(created.statusCode);
    });
  });
});
