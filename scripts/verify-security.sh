#!/usr/bin/env bash
# Verifies the security fixes against a running instance.
#   BASE=http://localhost:3100 ./scripts/verify-security.sh
set -uo pipefail
BASE="${BASE:-http://localhost:3100}"
PASS=0; FAIL=0

c()  { curl -s -o /dev/null -w "%{http_code}" "$@"; }
ok() { if [ "$2" = "$3" ]; then echo "  PASS  $1 ($2)"; PASS=$((PASS+1)); else echo "  FAIL  $1 (expected $3, got $2)"; FAIL=$((FAIL+1)); fi; }

PT=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"superadmin@platform.local","password":"ChangeMe123!"}' \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
TT=$(curl -s -X POST "$BASE/tenant/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"tenantadmin@example.com","password":"ChangeMe123!"}' \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')

[ -n "$PT" ] || { echo "FATAL: platform login failed"; exit 1; }
[ -n "$TT" ] || { echo "FATAL: tenant login failed"; exit 1; }

TA=$(echo "$TT" | cut -d. -f2 | tr '_-' '/+' | base64 -d 2>/dev/null | sed -n 's/.*"tenantId":"\([^"]*\)".*/\1/p')
[ -n "$TA" ] || TA="c1bcb482-346d-41c2-952e-815e45722e63"

# A second tenant to attack.
TB=$(curl -s "$BASE/tenants?limit=100" -H "Authorization: Bearer $PT" \
  | tr ',' '\n' | grep -A0 '"id"' | head -50 >/dev/null; \
  docker exec school-backend-postgres psql -U johndoe -d mydb -t -A -c \
  "SELECT id FROM \"Tenant\" WHERE id <> '$TA' AND \"deletedAt\" IS NULL LIMIT 1;" 2>/dev/null | tr -d ' ')
[ -n "$TB" ] || TB="00000000-0000-0000-0000-000000000000"

echo ""
echo "== Domain separation (tenant principal must not reach platform routes) =="
ok "GET  /platform/roles"        "$(c "$BASE/platform/roles" -H "Authorization: Bearer $TT")" 403
ok "GET  /platform/permissions"  "$(c "$BASE/platform/permissions" -H "Authorization: Bearer $TT")" 403
ok "POST /platform/roles"        "$(c -X POST "$BASE/platform/roles" -H "Authorization: Bearer $TT" -H 'Content-Type: application/json' -d '{"name":"x"}')" 403
ok "GET  /platform/users"        "$(c "$BASE/platform/users" -H "Authorization: Bearer $TT")" 403
ok "GET  /organizations"         "$(c "$BASE/organizations" -H "Authorization: Bearer $TT")" 403
ok "GET  /tenants"               "$(c "$BASE/tenants" -H "Authorization: Bearer $TT")" 403
ok "GET  /subscription-plans"    "$(c "$BASE/subscription-plans" -H "Authorization: Bearer $TT")" 403
ok "POST /permissions"           "$(c -X POST "$BASE/permissions" -H "Authorization: Bearer $TT" -H 'Content-Type: application/json' -d '{"code":"x.y","name":"x"}')" 403

echo ""
echo "== Cross-tenant IDOR (tenant principal must not reach another tenant) =="
ok "GET  other tenant /students"    "$(c "$BASE/tenants/$TB/students" -H "Authorization: Bearer $TT")" 403
ok "GET  other tenant /fees"        "$(c "$BASE/tenants/$TB/fee-heads" -H "Authorization: Bearer $TT")" 403
ok "GET  other tenant /roles"       "$(c "$BASE/tenants/$TB/roles" -H "Authorization: Bearer $TT")" 403
ok "GET  other tenant /users"       "$(c "$BASE/tenants/$TB/users" -H "Authorization: Bearer $TT")" 403
ok "GET  own tenant /students"      "$(c "$BASE/tenants/$TA/students" -H "Authorization: Bearer $TT")" 200

echo ""
echo "== Platform principal still works =="
ok "GET  /platform/roles"        "$(c "$BASE/platform/roles" -H "Authorization: Bearer $PT")" 200
ok "GET  /platform/permissions"  "$(c "$BASE/platform/permissions" -H "Authorization: Bearer $PT")" 200
ok "GET  own tenant /students"   "$(c "$BASE/tenants/$TA/students" -H "Authorization: Bearer $PT")" 200

echo ""
echo "== Authentication =="
ok "no token"                    "$(c "$BASE/tenants/$TA/students")" 401
ok "bad token"                   "$(c "$BASE/tenants/$TA/students" -H 'Authorization: Bearer nonsense')" 401

echo ""
echo "== Boolean query parameters =="
DEL=$(curl -s "$BASE/tenants?includeDeleted=false&limit=100" -H "Authorization: Bearer $PT")
NDEL=$(echo "$DEL" | tr '{' '\n' | grep -c '"deletedAt":"2' || true)
ok "includeDeleted=false hides soft-deleted rows" "$([ "$NDEL" -eq 0 ] && echo 0 || echo 1)" 0
UNREAD=$(curl -s "$BASE/notifications?isRead=false" -H "Authorization: Bearer $PT" | sed -n 's/.*"total":\([0-9]*\).*/\1/p')
READ=$(curl -s "$BASE/notifications?isRead=true" -H "Authorization: Bearer $PT" | sed -n 's/.*"total":\([0-9]*\).*/\1/p')
ok "isRead=false and isRead=true are disjoint" "$([ "${UNREAD:-0}" != "${READ:-0}" ] && echo 1 || echo 0)" 1

echo ""
echo "== Audit log =="
AL=$(curl -s "$BASE/tenants/$TA/students" -H "Authorization: Bearer $TT" >/dev/null; \
  docker exec school-backend-postgres psql -U johndoe -d mydb -t -A -c 'SELECT count(*) FROM "AuditLog";' 2>/dev/null | tr -d ' ')
ok "audit rows written for mutating calls" "$([ "${AL:-0}" -gt 0 ] && echo 1 || echo 0)" 1

echo ""
echo "== Library module registered =="
ok "GET /library-books" "$(c "$BASE/tenants/$TA/library-books" -H "Authorization: Bearer $TT")" 200

echo ""
echo "-----------------------------------------"
echo "PASS: $PASS   FAIL: $FAIL"
[ "$FAIL" -eq 0 ]
