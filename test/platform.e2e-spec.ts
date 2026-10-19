import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { ValidationPipe } from '@nestjs/common';

describe('Platform API (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const suffix = Date.now().toString();
  const rand = Array.from({ length: 8 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  const permCode = `e2e.read.${rand}`;
  const roleName = `E2E Role ${suffix}`;
  const userEmail = `e2e-${suffix}@test.com`;
  let userId: string;

  const auth = (r: request.Test) => r.set('Authorization', `Bearer ${token}`);

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
    await app.listen(0);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'superadmin@platform.local', password: 'ChangeMe123!' })
      .expect(201);
    token = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a permission', async () => {
    const res = await auth(request(app.getHttpServer())
      .post('/platform/permissions'))
      .send({ code: permCode, name: 'E2E Read', category: 'e2e' })
      .expect(201);
    expect(res.body.code).toBe(permCode);
  });

  it('rejects duplicate permission', async () => {
    await auth(request(app.getHttpServer())
      .post('/platform/permissions'))
      .send({ code: permCode, name: 'E2E Read', category: 'e2e' })
      .expect(409);
  });

  it('creates a role with the permission', async () => {
    const res = await auth(request(app.getHttpServer())
      .post('/platform/roles'))
      .send({ name: roleName, permissionCodes: [permCode] })
      .expect(201);
    expect(res.body.name).toBe(roleName);
  });

  it('creates a user with the role', async () => {
    const res = await auth(request(app.getHttpServer())
      .post('/platform/users'))
      .send({ email: userEmail, firstNameEn: 'E2E', firstNameNe: 'ई२ई', lastNameEn: 'User', lastNameNe: 'प्रयोगकर्ता', roleNames: [roleName] })
      .expect(201);
    expect(res.body.email).toBe(userEmail);
    userId = res.body.id;
  });

  it('rejects duplicate user', async () => {
    await auth(request(app.getHttpServer())
      .post('/platform/users'))
      .send({ email: userEmail, firstNameEn: 'E2E', firstNameNe: 'ई२ई', lastNameEn: 'User', lastNameNe: 'प्रयोगकर्ता' })
      .expect(409);
  });

  it('gets the user', async () => {
    const res = await auth(request(app.getHttpServer()).get(`/platform/users/${userId}`)).expect(200);
    expect(res.body.id).toBe(userId);
  });

  it('overrides a permission on the user', async () => {
    await auth(request(app.getHttpServer())
      .post(`/platform/users/${userId}/permissions`))
      .send({ permissionCodes: [permCode], granted: false })
      .expect(200);
  });

  it('soft deletes the user', async () => {
    await auth(request(app.getHttpServer()).delete(`/platform/users/${userId}`)).expect(200);
  });

  it('restores the user', async () => {
    const res = await auth(request(app.getHttpServer()).post(`/platform/users/${userId}/restore`)).expect(200);
    expect(res.body.deletedAt).toBeNull();
  });

  it('cannot delete role in use', async () => {
    await auth(request(app.getHttpServer()).delete(`/platform/roles/${roleName}`)).expect(409);
  });

  it('cannot delete permission in use', async () => {
    await auth(request(app.getHttpServer()).delete(`/platform/permissions/${permCode}`)).expect(409);
  });

  it('revokes role and deletes user, then role and permission', async () => {
    await auth(request(app.getHttpServer())
      .delete(`/platform/users/${userId}/roles`))
      .send({ roleNames: [roleName] })
      .expect(200);
    await auth(request(app.getHttpServer())
      .delete(`/platform/users/${userId}/permissions/${permCode}`))
      .expect(200);
    await auth(request(app.getHttpServer()).delete(`/platform/users/${userId}`)).expect(200);
    await auth(request(app.getHttpServer())
      .delete(`/platform/roles/${roleName}/permissions`))
      .send({ permissionCodes: [permCode] })
      .expect(200);
    await auth(request(app.getHttpServer()).delete(`/platform/roles/${roleName}`)).expect(200);
    await auth(request(app.getHttpServer()).delete(`/platform/permissions/${permCode}`)).expect(200);
  });

  it('rejects unauthenticated access', async () => {
    await request(app.getHttpServer()).get('/platform/users').expect(401);
  });
});