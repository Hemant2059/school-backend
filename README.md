# School SaaS Backend

Multi-tenant school-management system for Nepali schools, built with **NestJS 12**, **Prisma 7** and **PostgreSQL 17**.

The schema models the Nepali school domain in depth — bilingual `*En`/`*Ne` fields, Bikram Sambat / Gregorian date pairs, the NEB `Stream → GradeLevel → Section` hierarchy, theory + internal assessment splits, `EvaluationType { PERCENTAGE, GPA, LETTER, CGPA }`, IEMIS scholarship types, provincial and zonal address formats, Shrawan–Ashadh fiscal years, PAN/VAT and IEMIS codes, and the Nepali statutory payroll deductions (PF, SSF, CIT, TDS, SST).

## Tech stack

| | |
|---|---|
| Runtime | Node.js 22, TypeScript 6 (ESM) |
| Framework | NestJS 12 |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Database | PostgreSQL 17 |
| Auth | JWT (access + refresh), Passport, bcrypt |
| Validation | class-validator / class-transformer |
| Docs | Swagger at `/api-docs` (auto-generated from the DTOs) |
| Security | helmet, `@nestjs/throttler`, audit log |
| Testing | Vitest (unit + e2e) |

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

`JWT_SECRET` and `JWT_REFRESH_SECRET` are **required** and must be at least 32 characters, different from each other, and not one of the well-known development placeholders. The application refuses to start otherwise — it will never silently sign tokens with a fallback key.

```bash
openssl rand -base64 48   # use for each secret
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Run the migrations and seed

```bash
pnpm prisma migrate deploy
pnpm seed
```

### 5. Start the server

```bash
pnpm start:dev
```

- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/api-docs>
- Health: <http://localhost:3000/health>

### Docker (full stack)

```bash
docker compose up -d --build
```

The image applies the migrations on start-up, runs as a non-root user and has a health check. `JWT_SECRET` and `JWT_REFRESH_SECRET` must be present in the environment (a `.env` file is picked up automatically).

---

## Security model

### Two RBAC domains

Platform and tenant RBAC share the same permission *code* vocabulary (`roles.manage`, `students.read`, …). The boundary between the domains is enforced by a **domain marker**, not by the codes:

```ts
@PlatformOnly()   // only a SaaS company principal may reach this route
@Controller('platform/roles')
```

The `AuthorizationGuard` (`src/auth/guards/authorization.guard.ts`) enforces, in order:

1. `@Public()` routes are open.
2. A principal must exist.
3. **Domain check** — `@PlatformOnly()` requires a platform principal, `@TenantOnly()` a school principal.
4. **Tenant scope** — a school principal may only address the tenant in its token. The `:tenantId` route segment is attacker-controlled and is never trusted.
5. **Permission check** — every `@Permissions('code')` entry must be held.

### Tenant isolation

The tenant is taken from the token, not from the URL. A school administrator who changes `:tenantId` in the URL gets a 403.

### What the server owns

The client states intent; the server decides the arithmetic.

| Concern | Where it is enforced |
|---|---|
| Invoice totals, payable amount, balance | `FeeEngineService` |
| Invoice generation from the fee structure | `FeeEngineService` (per-month expansion, scholarships, brought-forward dues) |
| Invoice and receipt numbering | `DocumentSequenceService` (server-side, gap-free) |
| Payment → invoice allocation | `FeeEngineService` (one transaction) |
| Credit note effect on the invoice | `FeeEngineService` |
| Percentage, GPA, grade, ranks, attendance | `ExamResultService` |
| Letter grades and grade points | `ExamResultService` (from the grading scale) |
| Gross, PF/SSF, CIT, TDS, SST, net | `PayrollEngineService` |
| Capacity (section, hostel, room, vehicle, book copies) | the relevant service |
| Plan limits and subscription status | `TenantEntitlementService` |
| Audit trail | `AuditLogInterceptor` → `GET /platform/audit-logs` |

### Credential hygiene

Every query against `User` and `PlatformUser` uses an explicit projection. `passwordHash`, `refreshTokenHash`, `twoFactorSecret` and `invitationToken` are never serialised.

---

## Project structure

```
src/
  app.module.ts / main.ts
  config/                 # fail-fast environment validation
  common/                 # filters, interceptors, decorators, selectors, utils
  auth/                   # platform + tenant authentication, guards, decorators
  platform/               # platform users, roles, permissions, audit log
  organizations/          # educational foundations / parent entities
  tenants/                # individual schools / campuses
  subscriptions/          # subscription plans & dynamic features
  tenant-rbac/            # tenant roles, permissions, tenant users
  billing/                # tenant subscriptions, invoices, payments, entitlements
  academics/              # academic years, streams, grade levels, sections, staff, subjects
  students/               # students, addresses, guardians
  enrollments/            # enrolments
  exams/                  # exams, schedules, marks, summaries, results engine
  examinations/           # grading scales
  attendance/             # daily attendance registers and summaries
  timetable/              # the weekly timetable
  fees/                   # fiscal years, fee heads, class fee structures, scholarships
  fee-billing/            # fee invoices, items, payments, credit notes, fee engine
  hr/                     # teacher allocations, payroll runs, salary slips, payroll engine
  transport/              # vehicles, routes, stops, student transport
  hostel/                 # hostels, rooms, allocations
  library/                # library books & book issues
  notifications/          # per-principal in-app notifications
  transfer-certificates/  # transfer certificates
prisma/
  schema.prisma
  migrations/             # a replayable baseline + incremental migrations
  sql/                    # the partial unique indexes and check constraints
  seed.ts                 # idempotent development seed
scripts/
  verify-security.sh      # live security regression check
```

---

## Key domain behaviours

### Fees

`POST /tenants/:tenantId/fee-invoices/generate` builds an invoice from the tenant's class fee structure:

- `MONTHLY_BS` fee heads expand into one line per applicable Bikram Sambat month.
- Scholarships apply per fee head (percentage or flat amount, capped so a line can never go negative).
- Outstanding dues from earlier invoices are brought forward.
- The invoice number comes from a server-side, gap-free sequence.

`POST /tenants/:tenantId/fee-payments` records a receipt and applies it to the invoice in the same transaction. Receipts can be reversed; they are never erased. Credit notes reduce the balance and can never exceed it.

### Exams

An exam moves through `draft → published → locked`:

```
POST /tenants/:tenantId/exams/:id/publish
POST /tenants/:tenantId/exams/:id/lock
POST /tenants/:tenantId/exams/:id/generate-results
```

Marks are validated against the schedule (bounds, absent-versus-scored, class and academic year) and the letter grades are derived from the tenant's grading scale. Result generation computes the marks, percentage, credit-weighted GPA, final grade, section and grade ranks, and the attendance counters.

### Attendance

A section register is marked in one request; students with no entry are
recorded absent, so a day's register is always complete. A student can only
have one record per day.

### Timetable

A section cannot have two lessons in the same period, a teacher cannot be in
two places at once, and a teacher must actually be allocated to teach that
subject to that section.

### Payroll

`POST /tenants/:tenantId/payroll-runs/generate` computes every salary slip from the staff member's configured package:

- Provident Fund and Social Security Fund at 10% each, employee and employer, on the basic salary plus the grade allowance.
- One third of the employee's PF contribution reported as CIT.
- Monthly TDS withheld against the annual slab, with the 50% relief for an unmarried female taxpayer.
- 1% services tax.

The net is derived; deductions larger than the gross are rejected.

---

## Scripts

| Script | Description |
| --- | --- |
| `pnpm start` | Start the production server |
| `pnpm start:dev` | Start in watch mode |
| `pnpm build` | Compile TypeScript |
| `pnpm test` | Run the unit tests |
| `pnpm test:e2e` | Run the end-to-end tests (needs a seeded database) |
| `pnpm test:cov` | Run the unit tests with coverage |
| `pnpm seed` | Seed the development data (idempotent) |
| `pnpm prisma studio` | Open Prisma Studio |
| `pnpm lint` | Lint with oxlint and audit the DTO decorators |
| `pnpm verify` | Run every live verification script |

### Verification scripts

| Script | What it proves |
| --- | --- |
| `pnpm verify:security` | 22 assertions: domain separation, tenant isolation, authentication, boolean parameters, the audit trail and credential hygiene, against a running instance |
| `pnpm verify:domain` | 34 assertions: the fee engine, the result engine, the payroll rules, attendance and timetable, end to end against a running instance |
| `pnpm verify:migrations` | The migration chain replays cleanly against an empty database and the result matches the Prisma schema |

---

## Database notes

Soft delete is used throughout. Unique constraints are therefore **partial** (`WHERE deletedAt IS NULL`), so a record that has been soft-deleted does not block a new record with the same natural key. Prisma's schema language cannot express partial indexes, so they live in `prisma/sql/partial-unique-indexes.sql` and are applied by the migration.

Business rules that a schema language cannot express — non-negative amounts, marks within bounds, `min <= max` grade bands, a single current academic year — are enforced with `CHECK` constraints in the same file.

The migration history was squashed into a replayable baseline after a hand-edited migration made the previous chain impossible to replay against a fresh database. The old migrations are kept in `prisma/_migrations_archive` for reference.

---

## Default credentials (after seeding)

- **Platform super admin**: `superadmin@platform.local` / `ChangeMe123!`
- **Tenant school admin**: `tenantadmin@example.com` / `ChangeMe123!`

The seed refuses to invent these in production — set `SUPER_ADMIN_PASSWORD` and `TENANT_USER_PASSWORD` there.

---

## License

UNLICENSED (private)
