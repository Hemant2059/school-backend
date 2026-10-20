# School SaaS Backend

Multi-tenant school management system backend for Nepali schools, built with **NestJS**, **Prisma 7**, and **PostgreSQL**.

## Tech Stack

- **Runtime**: Node.js 22, TypeScript (ESM)
- **Framework**: NestJS 12
- **ORM**: Prisma 7 with `@prisma/adapter-pg`
- **Database**: PostgreSQL 17
- **Auth**: JWT (access + refresh), Passport, bcrypt
- **Validation**: class-validator / class-transformer
- **Docs**: Swagger (`/api-docs`)
- **Testing**: Vitest (unit + e2e)

## Project Structure

```
src/
  app.module.ts
  main.ts
  prisma.service.ts / prisma.module.ts
  auth/                 # Platform + tenant authentication, guards, decorators
  platform/             # Platform users, roles, permissions
  organizations/        # Educational foundations / parent entities
  tenants/              # Individual schools / campuses
  subscriptions/        # Subscription plans & dynamic features
  tenant-rbac/          # Tenant roles, permissions, tenant users
  billing/              # Tenant subscriptions, invoices, payments
  academics/            # Academic years, streams, grade levels, sections, staff, subjects
  students/             # Students, addresses, guardians, enrollments, transfer certificates
  exams/                # Exams, schedules, marks, summaries, grading scales
  fees/                 # Fiscal years, fee heads, class fee structures, scholarships
  fee-billing/          # IRD-compliant fee invoices, items, payments, credit notes
  hr/                   # Teacher allocations, payroll runs, salary slips
  transport/            # Vehicles, routes, stops, student transport
  hostel/               # Hostels, rooms, allocations
  library/              # Library books & book issues
  notifications/        # In-app notifications
prisma/
  schema.prisma
  migrations/
  seed.ts
postman/
  platform-rbac.postman_collection.json
```

## Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

See `.env.example` for all required variables.

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

### 3. Run migrations & seed

```bash
pnpm prisma migrate deploy
pnpm seed
```

### 4. Start the server

```bash
pnpm start:dev
```

Server: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs`  
Postman collection: `postman/platform-rbac.postman_collection.json`

## Docker (Full Stack)

Run both Postgres and the backend:

```bash
docker compose up -d --build
```

## Key Concepts

### Authentication & Authorization

- **Platform auth** (`/auth/*`): SaaS staff (super admin, support, sales partners)
- **Tenant auth** (`/tenant/auth/*`): School users (admin, teachers, students, parents)
- Global `JwtAuthGuard` + `PermissionsGuard` enforce authentication and permission-based authorization
- Route-level `@Permissions('code')` decorators

### Multi-Tenancy

- `Tenant` represents an individual school/campus
- `Organization` groups multiple campuses under a parent entity
- All tenant-scoped tables include `tenantId` as the leading column in composite indexes

### Global Identity

- `User` is a global identity (one phone/email across tenants)
- `TenantUser` links a global user to a tenant with roles

### Soft Deletes & Restore

- Most entities support soft delete (`deletedAt`) and restore endpoints
- Unique constraints use partial indexes (`WHERE deletedAt IS NULL`) so records can be recreated after deletion

### Nepal-Specific Features

- Bilingual fields (`*En` / `*Ne`)
- BS/AD date pairs (`*Ad` / `*Bs`)
- PAN/VAT, IEMIS codes, fiscal year (Shrawan–Ashadh)
- Provincial & zonal address formats
- IRD-compliant fee invoices with print count and sync flag
- Nepali payroll components (PF, CIT, SSF, TDS, SST)

## Database & Prisma

```bash
# Validate schema
pnpm prisma validate

# Create migration (dev)
pnpm prisma migrate dev --name <name>

# Apply migrations (prod)
pnpm prisma migrate deploy

# Generate client
pnpm prisma generate

# Open Prisma Studio
pnpm prisma studio

# Seed data
pnpm seed
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Scripts

| Script               | Description             |
| -------------------- | ----------------------- |
| `pnpm start`         | Start production server |
| `pnpm start:dev`     | Start in watch mode     |
| `pnpm build`         | Compile TypeScript      |
| `pnpm test`          | Run unit tests          |
| `pnpm test:e2e`      | Run e2e tests           |
| `pnpm seed`          | Seed database           |
| `pnpm prisma studio` | Open Prisma Studio      |

## Default Credentials (after seed)

- **Platform super admin**: `superadmin@platform.local` / `ChangeMe123!`
- **Tenant school admin**: `tenantadmin@example.com` / `ChangeMe123!`
- **Demo tenant ID**: `c1bcb482-346d-41c2-952e-815e45722e63`

## License

UNLICENSED (private)
