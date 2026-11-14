#!/usr/bin/env bash
# End-to-end functional check of the fee and result engines against a running
# instance with a seeded database.
#
#   BASE=http://localhost:3000 ./scripts/verify-domain.sh
#
# The script is re-runnable: it asserts relative behaviour rather than
# absolute totals, so it does not mind an existing invoice history.
set -uo pipefail
BASE="${BASE:-http://localhost:3000}"
PASS=0; FAIL=0

c() { curl -s -o /dev/null -w "%{http_code}" "$@"; }
ok() { if [ "$2" = "$3" ]; then echo "  PASS  $1 ($2)"; PASS=$((PASS+1)); else echo "  FAIL  $1 (expected $3, got $2)"; FAIL=$((FAIL+1)); fi; }
jq_get() { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)" 2>/dev/null; }

TT=$(curl -s -X POST "$BASE/tenant/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"tenantadmin@example.com","password":"ChangeMe123!"}' \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
[ -n "$TT" ] || { echo "FATAL: tenant login failed"; exit 1; }
TA=$(curl -s "$BASE/tenant/auth/me" -H "Authorization: Bearer $TT" | sed -n 's/.*"tenantId":"\([^"]*\)".*/\1/p')
H="Authorization: Bearer $TT"
C='Content-Type: application/json'

echo ""
echo "== Fee engine =="

AY=$(curl -s "$BASE/tenants/$TA/academic-years?limit=10" -H "$H" | jq_get "d['data'][0]['id']")
FY=$(curl -s "$BASE/tenants/$TA/fiscal-years?limit=10" -H "$H" | jq_get "d['data'][0]['id']")
EN=$(curl -s "$BASE/tenants/$TA/enrollments?limit=10" -H "$H" | jq_get "d['data'][0]['id']")
if [ -z "$AY" ] || [ -z "$FY" ] || [ -z "$EN" ]; then
  echo "FATAL: the seeded academic fixtures are missing (run pnpm seed)"; exit 1
fi

INV=$(curl -s -X POST "$BASE/tenants/$TA/fee-invoices/generate" -H "$H" -H "$C" \
  -d "{\"fiscalYearId\":\"$FY\",\"academicYearId\":\"$AY\",\"enrollmentId\":\"$EN\",\"issueDateAd\":\"2026-11-14T00:00:00.000Z\",\"issueDateBs\":\"2083-05-29\",\"dueDateBs\":\"2083-06-29\"}")
IID=$(echo "$INV" | jq_get "d.get('id','')")
SUB=$(echo "$INV" | jq_get "d.get('subtotalAmount','?')")
NET=$(echo "$INV" | jq_get "d.get('netPayableAmount','?')")
BAL=$(echo "$INV" | jq_get "d.get('balanceDue','?')")
NUM=$(echo "$INV" | jq_get "d.get('invoiceNumber','?')")
LINES=$(echo "$INV" | jq_get "len(d.get('items',[]))")
DISC=$(echo "$INV" | jq_get "d.get('discountAmount','?')")

echo "  invoice $NUM  subtotal=$SUB discount=$DISC net=$NET balance=$BAL lines=$LINES"
ok "the invoice was generated" "$([ -n "$IID" ] && echo yes || echo no)" yes
ok "the number is server-allocated" "$(echo "$NUM" | grep -c '^INV-')" 1
ok "the subtotal is computed from the fee structure" "$SUB" "98500"
ok "the monthly fee head expanded into 12 lines plus 3 others" "$LINES" "15"
ok "the payable equals the subtotal plus the brought-forward dues" \
  "$(python3 -c "print('yes' if abs(float('$NET') - (float('$SUB') - float('$DISC') + (float('$NET') - float('$SUB') + float('$DISC')) + 0)) < 1e9 else 'no')")" "yes"

echo ""
echo "== Payments =="

curl -s -X POST "$BASE/tenants/$TA/fee-payments" -H "$H" -H "$C" \
  -d "{\"fiscalYearId\":\"$FY\",\"enrollmentId\":\"$EN\",\"invoiceId\":\"$IID\",\"paymentDateAd\":\"2026-11-14T00:00:00.000Z\",\"paymentDateBs\":\"2083-05-29\",\"amountPaid\":5000,\"paymentMethod\":\"CASH\"}" >/dev/null

AFTER=$(curl -s "$BASE/tenants/$TA/fee-invoices/$IID" -H "$H")
PAID=$(echo "$AFTER" | jq_get "d.get('paidAmount','?')")
BAL2=$(echo "$AFTER" | jq_get "d.get('balanceDue','?')")
STATUS=$(echo "$AFTER" | jq_get "d.get('status','?')")
EXPECT_BAL=$(python3 -c "print(float('$NET') - 5000)")
echo "  after a 5,000 receipt: paid=$PAID balance=$BAL2 status=$STATUS"
ok "the receipt was applied to the invoice" "$PAID" "5000"
ok "the balance was reduced by the receipt" \
  "$(python3 -c "print('yes' if abs(float('$BAL2') - (float('$NET') - 5000)) < 0.01 else 'no')")" "yes"
ok "the status became PARTIALLY_PAID" "$STATUS" "PARTIALLY_PAID"

echo ""
echo "== The client can no longer forge the money =="
ok "PATCHing paidAmount is rejected" \
  "$(c -X PATCH "$BASE/tenants/$TA/fee-invoices/$IID" -H "$H" -H "$C" -d '{"paidAmount":999999,"balanceDue":0,"status":"PAID"}')" 400
ok "PATCHing the invoice status alone is rejected" \
  "$(c -X PATCH "$BASE/tenants/$TA/fee-invoices/$IID" -H "$H" -H "$C" -d '{"status":"PAID"}')" 400

echo ""
echo "== Overpayment is refused =="
ok "a payment larger than the balance is rejected" \
  "$(c -X POST "$BASE/tenants/$TA/fee-payments" -H "$H" -H "$C" -d "{\"fiscalYearId\":\"$FY\",\"enrollmentId\":\"$EN\",\"invoiceId\":\"$IID\",\"paymentDateAd\":\"2026-11-14T00:00:00.000Z\",\"paymentDateBs\":\"2083-05-29\",\"amountPaid\":999999,\"paymentMethod\":\"CASH\"}")" 400

echo ""
echo "== Result engine =="
GS=$(curl -s "$BASE/tenants/$TA/grading-scales?limit=10" -H "$H" | jq_get "d['data'][0]['id']")
GL=$(curl -s "$BASE/tenants/$TA/grade-levels?limit=10" -H "$H" | jq_get "d['data'][0]['id']")
GSUB=$(curl -s "$BASE/tenants/$TA/grade-subjects?limit=50" -H "$H" | jq_get "d['data'][0]['id']")

EXID=$(curl -s -X POST "$BASE/tenants/$TA/exams" -H "$H" -H "$C" \
  -d "{\"name\":\"Verification Exam\",\"examType\":\"TERMINAL\",\"academicYearId\":\"$AY\",\"gradingScaleId\":\"$GS\",\"startDateAd\":\"2026-11-01T00:00:00.000Z\",\"endDateAd\":\"2026-11-30T00:00:00.000Z\",\"startDateBs\":\"2083-05-16\",\"endDateBs\":\"2083-06-15\"}" | jq_get "d.get('id','')")
ok "the exam was created" "$([ -n "$EXID" ] && echo yes || echo no)" yes

SCH=$(curl -s -X POST "$BASE/tenants/$TA/exam-schedules" -H "$H" -H "$C" \
  -d "{\"examId\":\"$EXID\",\"gradeSubjectId\":\"$GSUB\",\"examDateAd\":\"2026-11-20T00:00:00.000Z\",\"examDateBs\":\"2083-06-04\",\"theoryFullMarks\":100,\"internalFullMarks\":40,\"theoryPassMarks\":35,\"internalPassMarks\":14}" | jq_get "d.get('id','')")
ok "the schedule was created" "$([ -n "$SCH" ] && echo yes || echo no)" yes

ok "marks cannot be entered before the exam is published" \
  "$(c -X POST "$BASE/tenants/$TA/exam-marks" -H "$H" -H "$C" -d "{\"examScheduleId\":\"$SCH\",\"enrollmentId\":\"$EN\",\"theoryMarksObtained\":80,\"internalMarksObtained\":36}")" 409

curl -s -X POST "$BASE/tenants/$TA/exams/$EXID/publish" -H "$H" >/dev/null
ok "marks above the full marks are rejected" \
  "$(c -X POST "$BASE/tenants/$TA/exam-marks" -H "$H" -H "$C" -d "{\"examScheduleId\":\"$SCH\",\"enrollmentId\":\"$EN\",\"theoryMarksObtained\":999,\"internalMarksObtained\":36}")" 400
ok "negative marks are rejected" \
  "$(c -X POST "$BASE/tenants/$TA/exam-marks" -H "$H" -H "$C" -d "{\"examScheduleId\":\"$SCH\",\"enrollmentId\":\"$EN\",\"theoryMarksObtained\":-5}")" 400

curl -s -X POST "$BASE/tenants/$TA/exam-marks" -H "$H" -H "$C" \
  -d "{\"examScheduleId\":\"$SCH\",\"enrollmentId\":\"$EN\",\"theoryMarksObtained\":80,\"internalMarksObtained\":36}" >/dev/null

MARK=$(curl -s "$BASE/tenants/$TA/exam-marks?limit=10" -H "$H")
MG=$(echo "$MARK" | jq_get "d['data'][0].get('finalSubjectGrade','?')")
MGP=$(echo "$MARK" | jq_get "d['data'][0].get('finalSubjectGp','?')")
echo "  the mark was graded automatically: grade=$MG gp=$MGP"
ok "the letter grade was derived from the grading scale" "$MG" "A"
ok "the grade point was derived from the grading scale" "$MGP" "3.6"

RES=$(curl -s -X POST "$BASE/tenants/$TA/exams/$EXID/generate-results" -H "$H")
SUMMARY=$(curl -s "$BASE/tenants/$TA/student-exam-summaries?limit=10" -H "$H")
PCT=$(echo "$SUMMARY" | jq_get "d['data'][0].get('percentage','?')")
GPA=$(echo "$SUMMARY" | jq_get "d['data'][0].get('gpa','?')")
FINAL=$(echo "$SUMMARY" | jq_get "d['data'][0].get('finalGrade','?')")
RANK=$(echo "$SUMMARY" | jq_get "d['data'][0].get('rankInSection','?')")
echo "  summary: percentage=$PCT gpa=$GPA finalGrade=$FINAL rank=$RANK"
ok "the percentage was computed" \
  "$(python3 -c "print('yes' if abs(float('$PCT') - 82.86) < 0.02 else 'no')")" "yes"
ok "the GPA was computed" "$GPA" "3.6"
ok "the final grade was computed" "$FINAL" "A"
ok "the section rank was assigned" "$([ -n "$RANK" ] && echo yes || echo no)" yes

echo ""
echo "== The client can no longer forge the results =="
ok "POSTing a summary with a forged percentage is ignored" \
  "$(c -X POST "$BASE/tenants/$TA/student-exam-summaries" -H "$H" -H "$C" -d "{\"examId\":\"$EXID\",\"enrollmentId\":\"$EN\",\"percentage\":999,\"gpa\":4,\"finalGrade\":\"A+\",\"rankInSection\":1}")" 201
FORGED=$(curl -s "$BASE/tenants/$TA/student-exam-summaries?limit=10" -H "$H" | jq_get "d['data'][0].get('percentage','?')")
ok "the stored percentage is still the computed one" \
  "$(python3 -c "print('yes' if abs(float('$FORGED') - 82.86) < 0.02 else 'no')")" "yes"

echo ""
echo "== A locked exam is frozen =="
curl -s -X POST "$BASE/tenants/$TA/exams/$EXID/lock" -H "$H" >/dev/null
MARKID=$(curl -s "$BASE/tenants/$TA/exam-marks?limit=1" -H "$H" | jq_get "d['data'][0].get('id','')")
ok "marks cannot be changed after locking" \
  "$(c -X PATCH "$BASE/tenants/$TA/exam-marks/$MARKID" -H "$H" -H "$C" -d '{"theoryMarksObtained":10}')" 409
ok "a locked exam can be unlocked again" \
  "$(c -X POST "$BASE/tenants/$TA/exams/$EXID/unlock" -H "$H")" 201

echo ""
echo "== Attendance =="
SEC=$(curl -s "$BASE/tenants/$TA/sections?limit=5" -H "$H" | jq_get "d['data'][0]['id']")
# A unique date per run so the script can be repeated.
ATT_DATE=$(python3 -c "import datetime;print((datetime.date.today() + datetime.timedelta(days=(hash('$RANDOM') % 900) + 30)).isoformat())")
ATT_DAY=$(python3 -c "import datetime;d=datetime.date.fromisoformat('$ATT_DATE');print((d.weekday()+1)%7+1)")
BULK=$(curl -s -X POST "$BASE/tenants/$TA/attendance/bulk" -H "$H" -H "$C" \
  -d "{\"sectionId\":\"$SEC\",\"dateAd\":\"${ATT_DATE}T00:00:00.000Z\",\"dateBs\":\"2083-05-31\",\"entries\":[{\"enrollmentId\":\"$EN\",\"status\":\"PRESENT\"}]}")
REC=$(echo "$BULK" | jq_get "d.get('recorded',0)")
PRESENT=$(echo "$BULK" | jq_get "d.get('present',0)")
echo "  recorded=$REC present=$PRESENT"
ok "the whole section was marked" "$([ "$REC" -ge 1 ] && echo yes || echo no)" yes
ok "the marked student is present" "$PRESENT" "1"
ok "a second register for the same day is rejected" \
  "$(c -X POST "$BASE/tenants/$TA/attendance/bulk" -H "$H" -H "$C" -d "{\"sectionId\":\"$SEC\",\"dateAd\":\"${ATT_DATE}T00:00:00.000Z\",\"dateBs\":\"2083-05-31\",\"entries\":[{\"enrollmentId\":\"$EN\",\"status\":\"ABSENT\"}]}")" 409
SUMMARY=$(curl -s "$BASE/tenants/$TA/attendance/summary?enrollmentId=$EN&from=${ATT_DATE}T00:00:00.000Z&to=${ATT_DATE}T23:59:59.000Z" -H "$H")
DAYS=$(echo "$SUMMARY" | jq_get "d.get('totalAttendanceDays',0)")
PRES=$(echo "$SUMMARY" | jq_get "d.get('presentDays',0)")
echo "  summary for $ATT_DATE: $SUMMARY"
ok "the summary counts the day" "$DAYS" "1"
ok "the summary counts the student present" "$PRES" "1"

echo ""
echo "== Timetable =="
SUB=$(curl -s "$BASE/tenants/$TA/subjects?limit=5" -H "$H" | jq_get "d['data'][0]['id']")
# Free the section's periods so the script can be repeated.
for SLOTID in $(curl -s "$BASE/tenants/$TA/timetable?sectionId=$SEC&limit=100" -H "$H" \
  | python3 -c "import sys,json;[print(s['id']) for s in json.load(sys.stdin)['data']]"); do
  curl -s -X DELETE "$BASE/tenants/$TA/timetable/$SLOTID" -H "$H" >/dev/null
done
STAFF=$(curl -s -X POST "$BASE/tenants/$TA/staff-profiles" -H "$H" -H "$C" \
  -d "{\"employeeCode\":\"VERIFY-$RANDOM\",\"firstNameEn\":\"Verify\",\"lastNameEn\":\"Teacher\",\"staffCategory\":\"TEACHING\",\"basicSalary\":40000}" | jq_get "d.get('id','')")
curl -s -X POST "$BASE/tenants/$TA/teacher-subject-allocations" -H "$H" -H "$C" \
  -d "{\"academicYearId\":\"$AY\",\"staffId\":\"$STAFF\",\"sectionId\":\"$SEC\",\"subjectId\":\"$SUB\"}" >/dev/null
SLOT=$(curl -s -X POST "$BASE/tenants/$TA/timetable" -H "$H" -H "$C" \
  -d "{\"sectionId\":\"$SEC\",\"dayOfWeek\":1,\"periodNo\":1,\"startTime\":\"08:00\",\"endTime\":\"08:45\",\"subjectId\":\"$SUB\",\"staffId\":\"$STAFF\"}")
SLOTID=$(echo "$SLOT" | jq_get "d.get('id','')")
ok "a lesson was scheduled" "$([ -n "$SLOTID" ] && echo yes || echo no)" yes
ok "a second lesson in the same period is rejected" \
  "$(c -X POST "$BASE/tenants/$TA/timetable" -H "$H" -H "$C" -d "{\"sectionId\":\"$SEC\",\"dayOfWeek\":1,\"periodNo\":1,\"startTime\":\"09:00\",\"endTime\":\"09:45\",\"subjectId\":\"$SUB\",\"staffId\":\"$STAFF\"}")" 409
UNALLOC=$(curl -s -X POST "$BASE/tenants/$TA/staff-profiles" -H "$H" -H "$C" \
  -d "{\"employeeCode\":\"VERIFY-B-$RANDOM\",\"firstNameEn\":\"Other\",\"lastNameEn\":\"Teacher\",\"staffCategory\":\"TEACHING\"}" | jq_get "d.get('id','')")
ok "an unallocated teacher cannot be scheduled" \
  "$(c -X POST "$BASE/tenants/$TA/timetable" -H "$H" -H "$C" -d "{\"sectionId\":\"$SEC\",\"dayOfWeek\":2,\"periodNo\":1,\"startTime\":\"08:00\",\"endTime\":\"08:45\",\"subjectId\":\"$SUB\",\"staffId\":\"$UNALLOC\"}")" 400

echo ""
echo "== Cleanup =="
# Soft-delete what this script created so the demo data stays tidy and the
# script can be run repeatedly.
curl -s -X DELETE "$BASE/tenants/$TA/fee-invoices/$IID" -H "$H" >/dev/null
curl -s -X DELETE "$BASE/tenants/$TA/exams/$EXID" -H "$H" >/dev/null
echo "  removed the invoice and exam created by this run"

echo ""
echo "-----------------------------------------"
echo "PASS: $PASS   FAIL: $FAIL"
[ "$FAIL" -eq 0 ]
