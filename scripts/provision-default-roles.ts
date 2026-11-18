import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { TenantProvisioningService } from '../src/tenants/services/tenant-provisioning.service.js';

/**
 * One-off backfill: ensures every existing tenant has the default role set.
 *
 * Tenants created before default roles were provisioned automatically
 * (see TenantProvisioningService) are missing some or all of the eight
 * system roles. The provisioning is additive and idempotent, so this is
 * safe to run repeatedly.
 *
 *   npx tsx scripts/provision-default-roles.ts
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// The provisioning service only uses role/rolePermission/permission methods,
// which the raw client provides.
const provisioning = new TenantProvisioningService(prisma as any);

async function main() {
  const tenants = await prisma.tenant.findMany({
    where: { deletedAt: null },
    select: { id: true, nameEn: true },
    orderBy: { createdAt: 'asc' },
  });

  let provisioned = 0;
  for (const tenant of tenants) {
    const before = await prisma.role.count({
      where: { tenantId: tenant.id, isSystem: true },
    });
    await provisioning.provisionDefaultRoles(tenant.id);
    const after = await prisma.role.count({
      where: { tenantId: tenant.id, isSystem: true },
    });
    console.log(
      `${tenant.nameEn} (${tenant.id}): ${before} -> ${after} system roles`,
    );
    if (after > before) provisioned++;
  }

  console.log(`\nDone. ${provisioned} tenant(s) received missing roles.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
