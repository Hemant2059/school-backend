#!/bin/sh
set -e

echo "==> Applying database migrations"
# Run the Prisma CLI directly rather than through `pnpm`: pnpm's
# dependency-status check refuses to run non-interactively against an
# image whose install intentionally ignored build scripts (prisma engines
# are built into the image already), and fails the boot.
if ! ./node_modules/.bin/prisma migrate deploy; then
  echo ""
  echo "############################################################"
  echo "# MIGRATION FAILED"
  echo "#"
  echo "# The database schema could not be migrated. The most common"
  echo "# causes are:"
  echo "#"
  echo "#  1. A migration in prisma/migrations cannot be replayed against"
  echo "#     this database. Inspect it with:"
  echo "#       pnpm prisma migrate status"
  echo "#       pnpm prisma migrate resolve --rolled-back <name>"
  echo "#"
  echo "#  2. A previously failed migration is still recorded in the"
  echo "#     _prisma_migrations table. Mark it as rolled back (after"
  echo "#     fixing the cause) or remove the stale row."
  echo "#"
  echo "# The application will not start with an out-of-date schema."
  echo "############################################################"
  echo ""
  exit 1
fi

echo "==> Starting the application"
exec node dist/main
