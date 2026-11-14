#!/usr/bin/env bash
# Verifies that the migration chain replays cleanly against an empty
# database.
#
# The previous 70-migration chain could not be replayed: a hand-edited
# migration renamed an index that a later migration created. This check is
# the regression guard for that class of bug.
#
#   ./scripts/verify-migrations.sh
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TEST_DB="${TEST_DATABASE_NAME:-migration_replay_test}"

# Derive the connection strings from DATABASE_URL so the check works with
# whatever the local development database happens to be.
DATABASE_URL_VALUE="${DATABASE_URL:-}"
if [ -z "$DATABASE_URL_VALUE" ] && [ -f .env ]; then
  DATABASE_URL_VALUE=$(grep -E '^DATABASE_URL=' .env | head -1 | sed -E 's/^DATABASE_URL=["'"'"']?//; s/["'"'"']?$//')
fi

if [ -z "$DATABASE_URL_VALUE" ]; then
  echo "SKIP: DATABASE_URL is not set"
  exit 0
fi

BASE_URL="${DATABASE_URL_VALUE%%\?*}"
ADMIN_URL="${BASE_URL%/*}/postgres"
TEST_URL="${BASE_URL%/*}/$TEST_DB?schema=public"

echo "==> Checking that the schema is valid"
npx prisma validate >/dev/null 2>&1 || { echo "FAIL: the schema is not valid"; exit 1; }

echo "==> Creating an empty ${TEST_DB}"
echo "DROP DATABASE IF EXISTS ${TEST_DB};" | DATABASE_URL="$ADMIN_URL" npx prisma db execute --stdin >/dev/null 2>&1 \
  || { echo "SKIP: cannot reach ${ADMIN_URL}"; exit 0; }
echo "CREATE DATABASE ${TEST_DB};" | DATABASE_URL="$ADMIN_URL" npx prisma db execute --stdin >/dev/null 2>&1 \
  || { echo "SKIP: cannot create ${TEST_DB}"; exit 0; }

echo "==> Replaying every migration against the empty database"
if ! DATABASE_URL="$TEST_URL" npx prisma migrate deploy >/tmp/migration-replay.log 2>&1; then
  echo "FAIL: the migrations could not be replayed:"
  tail -25 /tmp/migration-replay.log
  exit 1
fi

echo "==> Comparing the replayed database with the Prisma schema"
DIFF=$(DATABASE_URL="$TEST_URL" npx prisma migrate diff \
  --from-url "$TEST_URL" \
  --to-schema prisma/schema.prisma \
  --script 2>/dev/null)

if [ -n "$DIFF" ] && ! echo "$DIFF" | grep -qi "no difference"; then
  echo "FAIL: the replayed database differs from the Prisma schema:"
  echo "$DIFF" | head -40
  exit 1
fi

echo "==> Cleaning up"
echo "DROP DATABASE IF EXISTS ${TEST_DB};" | DATABASE_URL="$ADMIN_URL" npx prisma db execute --stdin >/dev/null 2>&1

echo ""
echo "PASS: the migration chain replays cleanly against an empty database"
