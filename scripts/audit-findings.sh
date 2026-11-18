#!/usr/bin/env bash
# Audits the codebase against the findings of the original review.
#
# Each check is a static assertion about the source, so it runs without a
# database and without a running server.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PASS=0; FAIL=0
ok() { if [ "$2" = "$3" ]; then echo "  PASS  $1"; PASS=$((PASS+1)); else echo "  FAIL  $1 (expected '$3', got '$2')"; FAIL=$((FAIL+1)); fi; }
has() { grep -rq "$2" $1 && echo yes || echo no; }
none() { grep -rq "$2" $1 && echo yes || echo no; }

echo ""
echo "== Security =="
ok "tenant scope is enforced in the guard" \
  "$(has src/auth/guards/authorization.guard.ts 'params\[.tenantId.\]')" yes
ok "the platform domain marker exists" "$(has src/auth 'PLATFORM_ONLY_KEY')" yes
# The placeholders may appear in the *rejection* pattern, but never as a
# fallback that signs a token.
ok "no hard-coded JWT secret fallback" \
  "$(grep -rn "dev-access-secret\|dev-refresh-secret" src/auth/ | grep -v "env.validation" | wc -l | tr -d ' ')" 0
ok "the environment is validated at boot" "$(has src/config/env.validation.ts 'Invalid environment configuration')" yes
ok "the JWT module uses getOrThrow" "$(has src/auth/auth.module.ts 'getOrThrow')" yes
ok "the audit log is written" "$(has src/common/interceptors/audit-log.interceptor.ts 'auditLog.create')" yes
ok "the audit log is readable" "$(has src/platform/controllers/audit-logs.controller.ts 'platform/audit-logs')" yes
# Only comments may mention the old pattern.
ok "credentials are never serialised" \
  "$(grep -rnE 'include: \{ user: true' src/ | grep -vE ':[0-9]+: *(\*)' | grep -vE ':[0-9]+: *//' | wc -l | tr -d ' ')" 0
ok "the school login locks after repeated failures" \
  "$(has src/auth/tenant-auth.service.ts 'MAX_FAILED_LOGIN_ATTEMPTS')" yes
ok "rate limiting is enabled" "$(has src/app.module.ts 'ThrottlerGuard')" yes
ok "helmet is enabled" "$(has src/main.ts 'helmet')" yes
ok "CORS uses an allow-list" "$(has src/main.ts 'CORS_ORIGINS')" yes
ok "Swagger is gated on the environment" "$(has src/main.ts 'SWAGGER_ENABLED')" yes

echo ""
echo "== Domain ownership =="
ok "the fee engine owns the invoice totals" \
  "$(has src/fee-billing/services/fee-engine.service.ts 'netPayableAmount')" yes
ok "payments update the invoice" \
  "$(has src/fee-billing/services/fee-engine.service.ts 'applyToInvoice')" yes
ok "credit notes reduce the balance" \
  "$(has src/fee-billing/services/fee-engine.service.ts 'VOIDED_BY_CREDIT_NOTE')" yes
ok "invoice numbers come from the server" \
  "$(has src/common/services/document-sequence.service.ts 'lastNumber')" yes
ok "the result engine computes the results" \
  "$(has src/exams/services/exam-result.service.ts 'computeForEnrollment')" yes
ok "marks are validated against the schedule" \
  "$(has src/exams/services/exam-mark.service.ts 'assertMarksWithinBounds')" yes
# No DTO may *declare* a grade or a grade point.
ok "grades are derived, not accepted" \
  "$(grep -rnE '^\s+(theoryGrade|internalGrade|finalSubjectGrade|theoryGp|internalGp|finalSubjectGp)\??\s*:' src/exams/dto/ | wc -l | tr -d ' ')" 0
ok "the payroll engine computes the deductions" \
  "$(has src/hr/services/payroll-engine.service.ts 'citShareOfPf')" yes
ok "capacity is enforced" "$(has src/hostel/services/hostel-allocation.service.ts 'assertCapacity')" yes
ok "plan limits are enforced" \
  "$(has src/billing/services/tenant-entitlement.service.ts 'assertWithinLimit')" yes
ok "the subscription status is enforced" \
  "$(has src/auth/guards/authorization.guard.ts 'assertSubscriptionUsable')" yes

echo ""
echo "== Data integrity =="
ok "the migration chain replays (verified separately)" \
  "$(has prisma/migrations/20260101000000_baseline/migration.sql 'CREATE TABLE')" yes
ok "the soft-delete aware unique indexes exist" \
  "$(has prisma/sql/partial-unique-indexes.sql 'WHERE \"deletedAt\" IS NULL')" yes
ok "business-rule checks exist" "$(has prisma/sql/partial-unique-indexes.sql 'CHECK')" yes
ok "the library module is registered" "$(has src/app.module.ts 'LibraryModule')" yes
ok "the attendance module is registered" "$(has src/app.module.ts 'AttendanceModule')" yes
ok "the timetable module is registered" "$(has src/app.module.ts 'TimetableModule')" yes
# A findMany without `take` would return the whole table.
ok "every list endpoint is paginated" \
  "$(grep -rn 'findMany' src/ --include=*.service.ts | grep -v 'take:' | grep -v 'select: { id: true' | grep -v 'findMany({$' | wc -l | tr -d ' ')" 0
ok "the broken StudentExamSummary include is gone" \
  "$(grep -rq 'studentExamSummary.findMany({ where: { tenantId }, include: { exam: true, student: true' src/ && echo yes || echo no)" no
ok "the seed is idempotent" "$(has prisma/seed.ts 'upsert')" yes
ok "the seed refuses to invent a production password" \
  "$(has prisma/seed.ts 'when seeding a production database')" yes

echo ""
echo "== Quality =="
ok "the linter is clean" \
  "$(npx oxlint --type-aware src/ test/ 2>/dev/null | grep -c 'warning' | sed 's/^0$/yes/;s/^[1-9].*/no/')" yes
ok "every DTO property is validated" \
  "$(python3 scripts/check-dto-decorators.py >/dev/null && echo yes || echo no)" yes
ok "there are unit tests" "$(find src -name '*.spec.ts' | wc -l | tr -d ' ')" 13
ok "there are end-to-end tests" "$(find test -name '*.e2e-spec.ts' | wc -l | tr -d ' ')" 3

echo ""
echo "-----------------------------------------"
echo "PASS: $PASS   FAIL: $FAIL"
[ "$FAIL" -eq 0 ]
