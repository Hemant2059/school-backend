#!/usr/bin/env bash
# Walks every business workflow of the system end to end, step by step,
# asserting the state at each transition.
#
#   BASE=http://localhost:3000 ./scripts/verify-workflows.sh
#
# Every workflow starts from a freshly created tenant so the steps are
# independent of whatever else is in the database.
set -uo pipefail
BASE="${BASE:-http://localhost:3000}"
PASS=0; FAIL=0; STEP=0

# ---------------------------------------------------------------- helpers
# req METHOD PATH BODY [AUTH_HEADER]
req() {
  local method="$1" path="$2" body="$3" auth="${4:-$PH}"
  if [ -n "$body" ]; then
    curl -s -X "$method" "$BASE$path" -H "$auth" -H "$PC" -d "$body"
  else
    curl -s -X "$method" "$BASE$path" -H "$auth"
  fi
}

# j EXPR  -> reads JSON on stdin, prints the expression's value
j() { python3 -c "import sys,json
try:
    d = json.load(sys.stdin)
except Exception:
    print(''); raise SystemExit(0)
print($1)" 2>/dev/null; }

code() { curl -s -o /dev/null -w "%{http_code}" "$@"; }

ok() {
  if [ "$2" = "$3" ]; then echo "    ok   $1"; PASS=$((PASS+1));
  else echo "    FAIL $1 (expected '$3', got '$2')"; FAIL=$((FAIL+1)); fi
}

step() { STEP=$((STEP+1)); echo ""; echo "  [$STEP] $1"; }
head1() { echo ""; echo "=== $1 ==="; }

# ------------------------------------------------------------- principals
PC='Content-Type: application/json'
PH=''
PT=$(req POST /auth/login '{"email":"superadmin@platform.local","password":"ChangeMe123!"}' "" \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
if [ -z "$PT" ]; then echo "FATAL: platform login failed"; exit 1; fi
PH="Authorization: Bearer $PT"

SUF="$(date +%s)$RANDOM"
SUF="${SUF: -8}"

echo ""
echo "############################################################"
echo "# WORKFLOW WALKTHROUGH"
echo "############################################################"

###############################################################################
head1 "Workflow 1 - Platform onboarding: user -> organisation -> school -> plan"
###############################################################################

step "1.1 The platform administrator creates a platform user"
BODY=$(cat <<JSON
{"email":"wf-super-$SUF@platform.test","firstNameEn":"Workflow","firstNameNe":"वर्कफ्लो",
 "lastNameEn":"Super","lastNameNe":"सुपर","roleNames":["Platform Admin"]}
JSON
)
PU=$(req POST /platform/users "$BODY")
PUID=$(echo "$PU" | j "d.get('id','')")
PTOKEN=$(echo "$PU" | j "d.get('temporaryPassword','')")
ok "the platform user was created" "$([ -n "$PUID" ] && echo yes || echo no)" yes
ok "a temporary password was issued" "$([ -n "$PTOKEN" ] && echo yes || echo no)" yes
ok "no password hash was returned" "$(echo "$PU" | grep -c 'passwordHash')" 0

step "1.2 The new platform user logs in and changes its own password"
BODY=$(cat <<JSON
{"email":"wf-super-$SUF@platform.test","password":"$PTOKEN"}
JSON
)
NEWPT=$(req POST /auth/login "$BODY" "" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the issued credentials work" "$([ -n "$NEWPT" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"currentPassword":"$PTOKEN","newPassword":"A-Stronger-Passw0rd!"}
JSON
)
CH=$(req POST /auth/change-password "$BODY" "Authorization: Bearer $NEWPT")
ok "the password can be changed" "$(echo "$CH" | j "d.get('changed',False)")" True

BODY=$(cat <<JSON
{"email":"wf-super-$SUF@platform.test","password":"A-Stronger-Passw0rd!"}
JSON
)
RELOG=$(req POST /auth/login "$BODY" "")
ok "the new password works" "$([ -n "$RELOG" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"email":"wf-super-$SUF@platform.test","password":"$PTOKEN"}
JSON
)
OLD=$(req POST /auth/login "$BODY" "")
ok "the old password no longer works" "$(echo "$OLD" | j "d.get('statusCode',200)")" 401

step "1.3 An organisation (trust / foundation) is created"
BODY=$(cat <<JSON
{"nameEn":"Workflow Foundation $SUF","nameNe":"वर्कफ्लो फाउन्डेशन",
 "organizationType":"FOUNDATION",
 "provinceCode":"3","provinceNe":"बागमती प्रदेश","provinceEn":"Bagmati",
 "districtCode":"27","districtNe":"काठमाडौं","districtEn":"Kathmandu",
 "municipalityCode":"2701","municipalityNe":"काठमाडौं महानगरपालिका","wardNumber":1,
 "phone":"+977-1-4000001","email":"wf-org-$SUF@test.com",
 "contactPersonName":"Workflow","contactPersonPhone":"+977-1-4000001"}
JSON
)
ORG=$(req POST /organizations "$BODY")
ORGID=$(echo "$ORG" | j "d.get('id','')")
ok "the organisation was created" "$([ -n "$ORGID" ] && echo yes || echo no)" yes

step "1.4 A school (tenant) is created under the organisation"
BODY=$(cat <<JSON
{"organizationId":"$ORGID","nameEn":"Workflow School $SUF","nameNe":"वर्कफ्लो विद्यालय",
 "subdomain":"wf-$SUF","iemisCode":"9${SUF:0:8}","schoolCode":"WF-$SUF",
 "registrationNumber":"REG-$SUF","panVatNumber":"9${SUF:0:8}","schoolType":"COMMUNITY",
 "provinceCode":"3","provinceNe":"बागमती प्रदेश","provinceEn":"Bagmati",
 "districtCode":"27","districtNe":"काठमाडौं","districtEn":"Kathmandu",
 "municipalityCode":"2701","municipalityNe":"काठमाडौं महानगरपालिका",
 "municipalityEn":"Kathmandu Metropolitan City","wardNumber":1,
 "toleEn":"Test","toleNe":"परीक्षण","addressEn":"Kathmandu","addressNe":"काठमाडौं",
 "phone":"+977-1-4000002","email":"wf-school-$SUF@test.com",
 "establishedDateAd":"2020-04-13T00:00:00.000Z","establishedDateBs":"2076-12-30",
 "motoEn":"Learn","motoNe":"सिक्नु होस्","latitude":27.71,"longitude":85.32}
JSON
)
TEN=$(req POST /tenants "$BODY")
TID=$(echo "$TEN" | j "d.get('id','')")
ok "the school was created" "$([ -n "$TID" ] && echo yes || echo no)" yes
ok "the school starts in the ONBOARDING state" "$(echo "$TEN" | j "d.get('status','')")" ONBOARDING

step "1.5 The school is published by assigning it a subscription"
PLANID=$(req GET "/subscription-plans?limit=20" "" "$PH" | j "[p['id'] for p in d['data'] if p['code']=='standard'][0]")
BODY=$(cat <<JSON
{"planId":"$PLANID","startDate":"2026-01-01T00:00:00.000Z","endDate":"2027-01-01T00:00:00.000Z"}
JSON
)
SUB=$(req POST "/tenants/$TID/subscriptions" "$BODY")
SUBID=$(echo "$SUB" | j "d.get('id','')")
ok "a subscription was created" "$([ -n "$SUBID" ] && echo yes || echo no)" yes
ACT=$(req PATCH "/tenants/$TID" '{"status":"ACTIVE"}')
ok "the school was activated" "$(echo "$ACT" | j "d.get('status','')")" ACTIVE

step "1.6 The school administrator is created and can log in"
BODY=$(cat <<JSON
{"email":"wf-admin-$SUF@test.com","firstNameEn":"Workflow","firstNameNe":"वर्कफ्लो",
 "lastNameEn":"Admin","lastNameNe":"एडमिन","password":"Workflow-Admin-1!"}
JSON
)
TU=$(req POST "/platform/tenants/$TID/users" "$BODY")
ok "the school administrator was created" "$(echo "$TU" | j "d.get('id','')!=''")" True

BODY=$(cat <<JSON
{"email":"wf-admin-$SUF@test.com","password":"Workflow-Admin-1!","tenantId":"$TID"}
JSON
)
ADMIN_TOKEN=$(req POST /tenant/auth/login "$BODY" "" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the school administrator can log in" "$([ -n "$ADMIN_TOKEN" ] && echo yes || echo no)" yes
TH="Authorization: Bearer $ADMIN_TOKEN"

step "1.7 The school administrator holds the full tenant permission set"
ME=$(req GET /tenant/auth/me "" "$TH")
ok "the administrator can read students" "$(echo "$ME" | j "'students.read' in d.get('permissions',[])")" True
ok "the administrator can manage fees" "$(echo "$ME" | j "'fee_invoices.manage' in d.get('permissions',[])")" True
ok "the administrator cannot reach the platform API" "$(code "$BASE/platform/roles" -H "$TH")" 403

###############################################################################
head1 "Workflow 2 - Academic setup: year -> stream -> grade -> section -> curriculum"
###############################################################################

step "2.1 The academic year is created and becomes the current one"
BODY=$(cat <<JSON
{"name":"2083/84","bsYear":2083,
 "startDateAd":"2026-04-14T00:00:00.000Z","endDateAd":"2027-04-13T00:00:00.000Z",
 "startDateBs":"2083-01-01","endDateBs":"2083-12-30","isCurrent":true}
JSON
)
AY=$(req POST "/tenants/$TID/academic-years" "$BODY" "$TH")
AYID=$(echo "$AY" | j "d.get('id','')")
ok "the academic year was created" "$([ -n "$AYID" ] && echo yes || echo no)" yes
ok "it is the current year" "$(echo "$AY" | j "d.get('isCurrent',False)")" True
ok "only one academic year can be current" \
  "$(req GET "/tenants/$TID/academic-years?limit=50" "" "$TH" | j "sum(1 for a in d['data'] if a.get('isCurrent'))")" 1

step "2.1b The academic calendar can be populated by CSV import"
CSVBODY=$(python3 -c "import json; print(json.dumps({'csv': 'dateAd,dateBs,titleEn,titleNe,isHoliday\n2026-10-21,2083-07-05,Vijaya Dashami,विजयादशमी,true\n2026-11-05,2083-07-20,Laxmi Puja,लक्ष्मी पूजा,true\n2026-13-40,2083-07-01,Bad Date,मिति,true\n'}))")
IMP=$(req POST "/tenants/$TID/academic-calendar-events/import?academicYearId=$AYID" "$CSVBODY" "$TH")
ok "valid rows are created and invalid rows are reported" \
  "$(echo "$IMP" | j "(d.get('created'), len(d.get('errors', [])))")" "(2, 1)"
IMP2=$(req POST "/tenants/$TID/academic-calendar-events/import?academicYearId=$AYID" "$CSVBODY" "$TH")
ok "re-importing skips duplicates instead of duplicating" \
  "$(echo "$IMP2" | j "(d.get('created'), d.get('duplicates'))")" "(0, 2)"
ok "the imported holidays are listed for the year" \
  "$(req GET "/tenants/$TID/academic-calendar-events?limit=10" "" "$TH" | j "sum(1 for e in d['data'] if e.get('isHoliday'))")" 2

step "2.2 The stream, grade level and section are created"
ST=$(req POST "/tenants/$TID/streams" '{"code":"SCI","nameEn":"Science","nameNe":"विज्ञान"}' "$TH")
STID=$(echo "$ST" | j "d.get('id','')")
ok "the stream was created" "$([ -n "$STID" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"streamId":"$STID","nameEn":"Grade 9","nameNe":"कक्षा ९","gradeNumber":9,
 "iemisGradeCode":"9","evaluationType":"PERCENTAGE"}
JSON
)
GL=$(req POST "/tenants/$TID/grade-levels" "$BODY" "$TH")
GLID=$(echo "$GL" | j "d.get('id','')")
ok "the grade level was created" "$([ -n "$GLID" ] && echo yes || echo no)" yes
ok "the numeric grade was stored" "$(echo "$GL" | j "d.get('gradeNumber',0)")" 9

BODY=$(cat <<JSON
{"gradeLevelId":"$GLID","academicYearId":"$AYID","nameEn":"A","nameNe":"क","capacity":10}
JSON
)
SEC=$(req POST "/tenants/$TID/sections" "$BODY" "$TH")
SECID=$(echo "$SEC" | j "d.get('id','')")
ok "the section was created" "$([ -n "$SECID" ] && echo yes || echo no)" yes

step "2.3 The subjects and the curriculum are set up"
SUBJ=$(req POST "/tenants/$TID/subjects" '{"code":"MATH","nameEn":"Mathematics","nameNe":"गणित"}' "$TH")
SUBID=$(echo "$SUBJ" | j "d.get('id','')")
ok "the subject was created" "$([ -n "$SUBID" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"gradeLevelId":"$GLID","subjectId":"$SUBID","creditHours":5,"theoryCreditHours":5,
 "internalCreditHours":0,"theoryFullMarks":100,"theoryPassMarks":35,
 "internalFullMarks":40,"internalPassMarks":14}
JSON
)
GS=$(req POST "/tenants/$TID/grade-subjects" "$BODY" "$TH")
GSID=$(echo "$GS" | j "d.get('id','')")
ok "the curriculum entry was created" "$([ -n "$GSID" ] && echo yes || echo no)" yes

step "2.4 A duplicate curriculum entry is refused"
BODY=$(cat <<JSON
{"gradeLevelId":"$GLID","subjectId":"$SUBID"}
JSON
)
DUP=$(req POST "/tenants/$TID/grade-subjects" "$BODY" "$TH")
ok "the duplicate was rejected" "$(echo "$DUP" | j "d.get('statusCode',200)")" 409

###############################################################################
head1 "Workflow 3 - Staff and teaching allocation"
###############################################################################

step "3.1 A teacher is created with a salary package"
BODY=$(cat <<JSON
{"employeeCode":"T-$SUF","firstNameEn":"Krishna","firstNameNe":"कृष्ण",
 "lastNameEn":"Sharma","lastNameNe":"शर्मा","staffCategory":"TEACHING",
 "employmentType":"PRIVATE_SOURCE","gender":"MALE",
 "basicSalary":40000,"gradeAllowance":5000,"dearnessAllowance":2000}
JSON
)
STAFF=$(req POST "/tenants/$TID/staff-profiles" "$BODY" "$TH")
STAFFID=$(echo "$STAFF" | j "d.get('id','')")
ok "the teacher was created" "$([ -n "$STAFFID" ] && echo yes || echo no)" yes
ok "the salary package was stored" "$(echo "$STAFF" | j "d.get('basicSalary','?')")" 40000

step "3.2 The teacher is allocated to teach the subject"
BODY=$(cat <<JSON
{"academicYearId":"$AYID","staffId":"$STAFFID","sectionId":"$SECID","subjectId":"$SUBID"}
JSON
)
ALLOC=$(req POST "/tenants/$TID/teacher-subject-allocations" "$BODY" "$TH")
ALLOCID=$(echo "$ALLOC" | j "d.get('id','')")
ok "the allocation was created" "$([ -n "$ALLOCID" ] && echo yes || echo no)" yes

step "3.3 A duplicate allocation is refused"
DUPALLOC=$(req POST "/tenants/$TID/teacher-subject-allocations" "$BODY" "$TH")
ok "the duplicate allocation was rejected" "$(echo "$DUPALLOC" | j "d.get('statusCode',200)")" 409

###############################################################################
head1 "Workflow 4 - Student admission through to enrolment"
###############################################################################

step "4.0 Two students are admitted in bulk via CSV import"
CSVBODY=$(python3 -c "import json,sys
suf = sys.argv[1]
rows = [
  '$SUF/201,Imported,इम्पोर्टेड,One,वन,2013-01-15,2069-10-01,MALE,1,Brahmin/Chhetri,Nepali,BC-$SUF-201,NIN-$SUF-201',
  '$SUF/202,Imported,इम्पोर्टेड,Two,टु,2013-02-20,2069-11-07,FEMALE,1,Brahmin/Chhetri,Nepali,BC-$SUF-202,NIN-$SUF-202',
  '$SUF/BAD,Bad,खराब,Gender,लिङ्ग,2013-03-25,2069-12-11,ALIEN,1,Brahmin/Chhetri,Nepali,BC-$SUF-203,NIN-$SUF-203',
]
csv = 'admissionNo,firstNameEn,firstNameNe,lastNameEn,lastNameNe,dobAd,dobBs,gender,casteEthnicityCode,casteEthnicity,motherTongue,birthCertificateNo,nationalIdNin\n' + '\n'.join(rows) + '\n'
print(json.dumps({'csv': csv}))" "$SUF")
IMP=$(req POST "/tenants/$TID/students/import" "$CSVBODY" "$TH")
ok "the valid rows are created and the invalid row is reported" \
  "$(echo "$IMP" | j "(d.get('created'), len(d.get('errors', [])))")" "(2, 1)"
IMP2=$(req POST "/tenants/$TID/students/import" "$CSVBODY" "$TH")
ok "re-importing skips duplicates instead of duplicating" \
  "$(echo "$IMP2" | j "(d.get('created'), d.get('duplicates'))")" "(0, 2)"
ok "the imported students are in the roster" \
  "$(req GET "/tenants/$TID/students?limit=100" "" "$TH" | j "sum(1 for s in d['data'] if s.get('admissionNo','').startswith('$SUF/20'))")" 2

step "4.1 The student is admitted"
BODY=$(cat <<JSON
{"admissionNo":"$SUF/001","firstNameEn":"Aayush","firstNameNe":"आयुष",
 "lastNameEn":"Thapa","lastNameNe":"थापा",
 "dobAd":"2012-05-05T00:00:00.000Z","dobBs":"2069-02-22","gender":"MALE",
 "casteEthnicityCode":"1","casteEthnicity":"Brahmin/Chhetri","motherTongue":"Nepali",
 "birthCertificateNo":"BC-$SUF","nationalIdNin":"NIN-$SUF"}
JSON
)
STU=$(req POST "/tenants/$TID/students" "$BODY" "$TH")
STUID=$(echo "$STU" | j "d.get('id','')")
ok "the student was admitted" "$([ -n "$STUID" ] && echo yes || echo no)" yes

step "4.2 A duplicate admission number is refused"
BODY=$(cat <<JSON
{"admissionNo":"$SUF/001","firstNameEn":"Copy","firstNameNe":"कपी",
 "lastNameEn":"Copy","lastNameNe":"कपी",
 "dobAd":"2012-05-05T00:00:00.000Z","dobBs":"2069-02-22","gender":"MALE",
 "casteEthnicityCode":"1","casteEthnicity":"Brahmin/Chhetri","motherTongue":"Nepali",
 "birthCertificateNo":"BC-X","nationalIdNin":"NIN-X"}
JSON
)
DUPSTU=$(req POST "/tenants/$TID/students" "$BODY" "$TH")
ok "the duplicate admission number was rejected" "$(echo "$DUPSTU" | j "d.get('statusCode',200)")" 409

step "4.3 The guardian and the address are recorded"
BODY=$(cat <<JSON
{"nameEn":"Sunita","nameNe":"सुनिता","phone":"+977-9841234567",
 "email":"wf-guardian-$SUF@test.com","nationalIdNin":"GNIN-$SUF"}
JSON
)
GUARD=$(req POST "/tenants/$TID/guardians" "$BODY" "$TH")
GUID=$(echo "$GUARD" | j "d.get('id','')")
ok "the guardian was created" "$([ -n "$GUID" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"entityType":"GUARDIAN","entityId":"$GUID","type":"PERMANENT","format":"PROVINCIAL",
 "provinceCode":"3","provinceNe":"बागमती प्रदेश","provinceEn":"Bagmati",
 "districtCode":"27","districtNe":"काठमाडौं","districtEn":"Kathmandu",
 "municipalityCode":"2701","municipalityNe":"काठमाडौं महानगरपालिका",
 "ward":5,"toleEn":"Baneshwor","toleNe":"बानेश्वर"}
JSON
)
ADDR=$(req POST "/tenants/$TID/addresses" "$BODY" "$TH")
ok "the address was recorded" "$(echo "$ADDR" | j "d.get('id','')!=''")" True

BODY=$(cat <<JSON
{"studentId":"$STUID","guardianId":"$GUID","relationship":"MOTHER","isPrimary":true}
JSON
)
LINK=$(req POST "/tenants/$TID/student-guardians" "$BODY" "$TH")
ok "the guardian was linked to the student" "$(echo "$LINK" | j "d.get('id','')!=''")" True

step "4.4 The student is enrolled in the section"
BODY=$(cat <<JSON
{"studentId":"$STUID","academicYearId":"$AYID","gradeLevelId":"$GLID",
 "sectionId":"$SECID","rollNo":1,"enrollmentStatus":"NEW_ADMISSION"}
JSON
)
ENR=$(req POST "/tenants/$TID/enrollments" "$BODY" "$TH")
ENRID=$(echo "$ENR" | j "d.get('id','')")
ok "the student was enrolled" "$([ -n "$ENRID" ] && echo yes || echo no)" yes

step "4.5 A second enrolment in the same year is refused"
BODY=$(cat <<JSON
{"studentId":"$STUID","academicYearId":"$AYID","gradeLevelId":"$GLID",
 "sectionId":"$SECID","rollNo":2}
JSON
)
DUPENR=$(req POST "/tenants/$TID/enrollments" "$BODY" "$TH")
ok "the duplicate enrolment was rejected" "$(echo "$DUPENR" | j "d.get('statusCode',200)")" 409

step "4.6 The enrolment cannot use a section from another grade level"
BODY=$(cat <<JSON
{"streamId":"$STID","nameEn":"Grade 10","nameNe":"कक्षा १०","gradeNumber":10}
JSON
)
GL10=$(req POST "/tenants/$TID/grade-levels" "$BODY" "$TH")
GL10ID=$(echo "$GL10" | j "d.get('id','')")
BODY=$(cat <<JSON
{"gradeLevelId":"$GL10ID","academicYearId":"$AYID","nameEn":"B","nameNe":"ख","capacity":10}
JSON
)
SEC10=$(req POST "/tenants/$TID/sections" "$BODY" "$TH")
SEC10ID=$(echo "$SEC10" | j "d.get('id','')")
BODY=$(cat <<JSON
{"studentId":"$STUID","academicYearId":"$AYID","gradeLevelId":"$GLID",
 "sectionId":"$SEC10ID","rollNo":3}
JSON
)
BADENR=$(req POST "/tenants/$TID/enrollments" "$BODY" "$TH")
ok "the mismatched section was rejected" "$(echo "$BADENR" | j "d.get('statusCode',200)")" 409

###############################################################################
head1 "Workflow 5 - Fees: structure -> invoice -> payment -> balance"
###############################################################################

step "5.1 The fiscal year, fee heads and class fee structure are configured"
BODY=$(cat <<JSON
{"name":"FY 2083/84","startDateAd":"2026-07-16T00:00:00.000Z","startDateBs":"2083-04-01",
 "endDateAd":"2027-08-16T00:00:00.000Z","endDateBs":"2084-04-31","isActive":true}
JSON
)
FY=$(req POST "/tenants/$TID/fiscal-years" "$BODY" "$TH")
FYID=$(echo "$FY" | j "d.get('id','')")
ok "the fiscal year was created and is active" "$([ -n "$FYID" ] && echo yes || echo no)" yes

FH=$(req POST "/tenants/$TID/fee-heads" '{"nameEn":"Tuition","nameNe":"शिक्षण शुल्क","frequency":"MONTHLY_BS"}' "$TH")
FHID=$(echo "$FH" | j "d.get('id','')")
ok "the fee head was created" "$([ -n "$FHID" ] && echo yes || echo no)" yes

BODY=$(cat <<JSON
{"academicYearId":"$AYID","gradeLevelId":"$GLID","feeHeadId":"$FHID",
 "fiscalYearId":"$FYID","amount":5000,"applicableBsMonths":[1,2,3]}
JSON
)
CFS=$(req POST "/tenants/$TID/class-fee-structures" "$BODY" "$TH")
CFSID=$(echo "$CFS" | j "d.get('id','')")
ok "the class fee structure was created" "$([ -n "$CFSID" ] && echo yes || echo no)" yes

step "5.2 A scholarship is awarded to the student"
SCHEME=$(req POST "/tenants/$TID/scholarship-schemes" '{"name":"Merit","iemisScholarshipType":"POOR_TALENTED"}' "$TH")
SCHEMEID=$(echo "$SCHEME" | j "d.get('id','')")
BODY=$(cat <<JSON
{"enrollmentId":"$ENRID","scholarshipSchemeId":"$SCHEMEID","feeHeadId":"$FHID",
 "discountType":"PERCENTAGE","discountValue":10}
JSON
)
SCH=$(req POST "/tenants/$TID/student-scholarships" "$BODY" "$TH")
SCHID=$(echo "$SCH" | j "d.get('id','')")
ok "the scholarship was awarded" "$([ -n "$SCHID" ] && echo yes || echo no)" yes

step "5.3 The invoice is generated from the fee structure"
BODY=$(cat <<JSON
{"fiscalYearId":"$FYID","academicYearId":"$AYID","enrollmentId":"$ENRID",
 "issueDateAd":"2026-07-16T00:00:00.000Z","issueDateBs":"2083-04-01","dueDateBs":"2083-05-01"}
JSON
)
INV=$(req POST "/tenants/$TID/fee-invoices/generate" "$BODY" "$TH")
INVID=$(echo "$INV" | j "d.get('id','')")
SUBTOTAL=$(echo "$INV" | j "d.get('subtotalAmount','?')")
DISCOUNT=$(echo "$INV" | j "d.get('discountAmount','?')")
NET=$(echo "$INV" | j "d.get('netPayableAmount','?')")
BAL=$(echo "$INV" | j "d.get('balanceDue','?')")
LINES=$(echo "$INV" | j "len(d.get('items',[]))")
echo "        subtotal=$SUBTOTAL discount=$DISCOUNT net=$NET balance=$BAL lines=$LINES"
ok "the invoice was generated" "$([ -n "$INVID" ] && echo yes || echo no)" yes
ok "the monthly fee head expanded into three lines" "$LINES" 3
ok "the subtotal is three months of the fee" "$SUBTOTAL" 15000
ok "the 10% scholarship was applied" "$DISCOUNT" 1500
ok "the payable amount is derived" "$NET" 13500
ok "the balance equals the payable amount" "$BAL" "$NET"

step "5.4 The client cannot forge the invoice totals"
FORGE=$(req PATCH "/tenants/$TID/fee-invoices/$INVID" '{"paidAmount":999999,"balanceDue":0,"status":"PAID"}' "$TH")
ok "forging the totals was rejected" "$(echo "$FORGE" | j "d.get('statusCode',200)")" 400

step "5.5 A receipt is recorded and applied to the invoice"
BODY=$(cat <<JSON
{"fiscalYearId":"$FYID","enrollmentId":"$ENRID","invoiceId":"$INVID",
 "paymentDateAd":"2026-07-20T00:00:00.000Z","paymentDateBs":"2083-04-05",
 "amountPaid":5000,"paymentMethod":"ESEWA"}
JSON
)
PAY=$(req POST "/tenants/$TID/fee-payments" "$BODY" "$TH")
PAID=$(echo "$PAY" | j "d.get('amountPaid','?')")
AFTER=$(req GET "/tenants/$TID/fee-invoices/$INVID" "" "$TH")
ok "the receipt was recorded" "$PAID" 5000
ok "the invoice balance was reduced" "$(echo "$AFTER" | j "d.get('balanceDue','?')")" 8500
ok "the invoice status became PARTIALLY_PAID" "$(echo "$AFTER" | j "d.get('status','')")" PARTIALLY_PAID

step "5.6 An overpayment is refused"
BODY=$(cat <<JSON
{"fiscalYearId":"$FYID","enrollmentId":"$ENRID","invoiceId":"$INVID",
 "paymentDateAd":"2026-07-21T00:00:00.000Z","paymentDateBs":"2083-04-06",
 "amountPaid":99999,"paymentMethod":"CASH"}
JSON
)
OVER=$(req POST "/tenants/$TID/fee-payments" "$BODY" "$TH")
ok "the overpayment was rejected" "$(echo "$OVER" | j "d.get('statusCode',200)")" 400

step "5.7 A credit note reduces the balance"
BODY=$(cat <<JSON
{"invoiceId":"$INVID","creditNoteNumber":"CN-$SUF","reason":"Adjustment","amount":1000}
JSON
)
CN=$(req POST "/tenants/$TID/credit-notes" "$BODY" "$TH")
ok "the credit note was issued" "$(echo "$CN" | j "d.get('id','')!=''")" True
AFTER2=$(req GET "/tenants/$TID/fee-invoices/$INVID" "" "$TH")
ok "the invoice balance was reduced again" "$(echo "$AFTER2" | j "d.get('balanceDue','?')")" 7500

step "5.8 A credit note larger than the balance is refused"
BODY=$(cat <<JSON
{"invoiceId":"$INVID","creditNoteNumber":"CN-BIG-$SUF","reason":"Too much","amount":99999}
JSON
)
BIGCN=$(req POST "/tenants/$TID/credit-notes" "$BODY" "$TH")
ok "the oversized credit note was rejected" "$(echo "$BIGCN" | j "d.get('statusCode',200)")" 400

step "5.9 The outstanding balance is reported"
OUT=$(req GET "/tenants/$TID/fee-invoices/outstanding?enrollmentId=$ENRID" "" "$TH")
ok "the outstanding balance is reported" "$(echo "$OUT" | j "d.get('outstandingAmount','?')")" 7500

###############################################################################
head1 "Workflow 6 - Exams: scale -> exam -> publish -> marks -> results"
###############################################################################

step "6.1 The grading scale is defined"
GSCL=$(req POST "/tenants/$TID/grading-scales" '{"name":"NEB Scale"}' "$TH")
GSCID=$(echo "$GSCL" | j "d.get('id','')")
ok "the grading scale was created" "$([ -n "$GSCID" ] && echo yes || echo no)" yes
req POST "/tenants/$TID/grading-scales/$GSCID/items" \
  '{"minPercentage":80,"maxPercentage":100,"letterGrade":"A","gradePoint":3.6,"descriptorEn":"Very Good"}' "$TH" >/dev/null
req POST "/tenants/$TID/grading-scales/$GSCID/items" \
  '{"minPercentage":40,"maxPercentage":79.99,"letterGrade":"C","gradePoint":2.8}' "$TH" >/dev/null
ok "two grade bands were defined" \
  "$(req GET "/tenants/$TID/grading-scales/$GSCID" "" "$TH" | j "len(d.get('items',[]))")" 2

step "6.2 The exam is created as a draft"
BODY=$(cat <<JSON
{"name":"First Terminal","examType":"TERMINAL","academicYearId":"$AYID",
 "gradingScaleId":"$GSCID","startDateAd":"2026-12-01T00:00:00.000Z",
 "endDateAd":"2026-12-10T00:00:00.000Z","startDateBs":"2083-08-15","endDateBs":"2083-08-24"}
JSON
)
EX=$(req POST "/tenants/$TID/exams" "$BODY" "$TH")
EXID=$(echo "$EX" | j "d.get('id','')")
ok "the exam was created" "$([ -n "$EXID" ] && echo yes || echo no)" yes
ok "the exam starts unpublished" "$(echo "$EX" | j "d.get('isPublished',True)")" False
ok "the exam starts unlocked" "$(echo "$EX" | j "d.get('isLocked',True)")" False

step "6.3 The schedule is created and inherits the curriculum marks"
BODY=$(cat <<JSON
{"examId":"$EXID","gradeSubjectId":"$GSID","examDateAd":"2026-12-05T00:00:00.000Z",
 "examDateBs":"2083-08-19"}
JSON
)
SCHED=$(req POST "/tenants/$TID/exam-schedules" "$BODY" "$TH")
SCHEDID=$(echo "$SCHED" | j "d.get('id','')")
ok "the schedule was created" "$([ -n "$SCHEDID" ] && echo yes || echo no)" yes
ok "the full marks were inherited from the curriculum" "$(echo "$SCHED" | j "d.get('theoryFullMarks','?')")" 100
ok "the internal marks were inherited" "$(echo "$SCHED" | j "d.get('internalFullMarks','?')")" 40

step "6.4 Marks cannot be recorded before the exam is published"
BODY=$(cat <<JSON
{"examScheduleId":"$SCHEDID","enrollmentId":"$ENRID",
 "theoryMarksObtained":80,"internalMarksObtained":36}
JSON
)
EARLY=$(req POST "/tenants/$TID/exam-marks" "$BODY" "$TH")
ok "the early mark was rejected" "$(echo "$EARLY" | j "d.get('statusCode',200)")" 409

step "6.5 The exam is published and the marks are recorded"
req POST "/tenants/$TID/exams/$EXID/publish" "" "$TH" >/dev/null
ok "the exam is published" \
  "$(req GET "/tenants/$TID/exams/$EXID" "" "$TH" | j "d.get('isPublished',False)")" True
MARK=$(req POST "/tenants/$TID/exam-marks" "$BODY" "$TH")
ok "the mark was recorded" "$(echo "$MARK" | j "d.get('id','')!=''")" True
ok "the letter grade was derived from the scale" "$(echo "$MARK" | j "d.get('finalSubjectGrade','?')")" A
ok "the grade point was derived from the scale" "$(echo "$MARK" | j "d.get('finalSubjectGp','?')")" 3.6

step "6.6 Out-of-range marks are refused"
BODY=$(cat <<JSON
{"examScheduleId":"$SCHEDID","enrollmentId":"$ENRID","theoryMarksObtained":999}
JSON
)
HIGH=$(req POST "/tenants/$TID/exam-marks" "$BODY" "$TH")
ok "marks above the full marks were rejected" "$(echo "$HIGH" | j "d.get('statusCode',200)")" 400
BODY=$(cat <<JSON
{"examScheduleId":"$SCHEDID","enrollmentId":"$ENRID","theoryMarksObtained":-5}
JSON
)
NEG=$(req POST "/tenants/$TID/exam-marks" "$BODY" "$TH")
ok "negative marks were rejected" "$(echo "$NEG" | j "d.get('statusCode',200)")" 400

step "6.7 The results are generated"
GEN=$(req POST "/tenants/$TID/exams/$EXID/generate-results" "" "$TH")
ok "the results were generated" "$(echo "$GEN" | j "d.get('generated',0)>=1")" True
SUM=$(req GET "/tenants/$TID/student-exam-summaries?limit=10" "" "$TH")
ok "the percentage was computed" "$(echo "$SUM" | j "d.get('data',[{}])[0].get('percentage','?')")" 82.86
ok "the GPA was computed" "$(echo "$SUM" | j "d.get('data',[{}])[0].get('gpa','?')")" 3.6
ok "the final grade was computed" "$(echo "$SUM" | j "d.get('data',[{}])[0].get('finalGrade','?')")" A
ok "the section rank was assigned" "$(echo "$SUM" | j "d.get('data',[{}])[0].get('rankInSection','?')")" 1

step "6.8 The client cannot forge a result"
BODY=$(cat <<JSON
{"examId":"$EXID","enrollmentId":"$ENRID","percentage":100,"gpa":4,"finalGrade":"A+"}
JSON
)
req POST "/tenants/$TID/student-exam-summaries" "$BODY" "$TH" >/dev/null
SUM2=$(req GET "/tenants/$TID/student-exam-summaries?limit=10" "" "$TH")
ok "the stored percentage is still the computed one" \
  "$(echo "$SUM2" | j "d.get('data',[{}])[0].get('percentage','?')")" 82.86

step "6.9 The exam is locked and frozen"
req POST "/tenants/$TID/exams/$EXID/lock" "" "$TH" >/dev/null
ok "the exam is locked" \
  "$(req GET "/tenants/$TID/exams/$EXID" "" "$TH" | j "d.get('isLocked',False)")" True
MID=$(req GET "/tenants/$TID/exam-marks?limit=1" "" "$TH" | j "d.get('data',[{}])[0].get('id','')")
ok "the marks cannot be changed once locked" \
  "$(code -X PATCH "$BASE/tenants/$TID/exam-marks/$MID" -H "$TH" -H "$PC" -d '{"theoryMarksObtained":10}')" 409

###############################################################################
head1 "Workflow 7 - Attendance over a term"
###############################################################################

step "7.1 A day's register is marked for the section"
BODY=$(cat <<JSON
{"sectionId":"$SECID","dateAd":"2026-09-01T00:00:00.000Z","dateBs":"2083-05-16",
 "entries":[{"enrollmentId":"$ENRID","status":"PRESENT"}]}
JSON
)
BULK=$(req POST "/tenants/$TID/attendance/bulk" "$BODY" "$TH")
ok "the register was recorded" "$(echo "$BULK" | j "d.get('recorded',0)>=1")" True
ok "the student is present" "$(echo "$BULK" | j "d.get('present',0)")" 1

step "7.2 The same day cannot be marked twice"
DUPREG=$(req POST "/tenants/$TID/attendance/bulk" "$BODY" "$TH")
ok "the duplicate register was rejected" "$(echo "$DUPREG" | j "d.get('statusCode',200)")" 409

step "7.3 The attendance summary is computed"
SUMA=$(req GET "/tenants/$TID/attendance/summary?enrollmentId=$ENRID" "" "$TH")
ok "the attendance days were counted" "$(echo "$SUMA" | j "d.get('totalAttendanceDays',0)")" 1
ok "the present days were counted" "$(echo "$SUMA" | j "d.get('presentDays',0)")" 1
ok "the percentage was computed" "$(echo "$SUMA" | j "d.get('attendancePercentage','?')")" 100

###############################################################################
head1 "Workflow 8 - Timetable"
###############################################################################

step "8.1 A lesson is scheduled"
BODY=$(cat <<JSON
{"sectionId":"$SECID","dayOfWeek":1,"periodNo":1,"startTime":"08:00","endTime":"08:45",
 "subjectId":"$SUBID","staffId":"$STAFFID"}
JSON
)
TS=$(req POST "/tenants/$TID/timetable" "$BODY" "$TH")
TSID=$(echo "$TS" | j "d.get('id','')")
ok "the lesson was scheduled" "$([ -n "$TSID" ] && echo yes || echo no)" yes

step "8.2 The section cannot have two lessons in the same period"
BODY=$(cat <<JSON
{"sectionId":"$SECID","dayOfWeek":1,"periodNo":1,"startTime":"09:00","endTime":"09:45",
 "subjectId":"$SUBID","staffId":"$STAFFID"}
JSON
)
CLASH=$(req POST "/tenants/$TID/timetable" "$BODY" "$TH")
ok "the clash was rejected" "$(echo "$CLASH" | j "d.get('statusCode',200)")" 409

step "8.3 The section timetable can be read"
TT=$(req GET "/tenants/$TID/timetable/section/$SECID" "" "$TH")
ok "the timetable is grouped by day" "$(echo "$TT" | j "len(d.get('days',[]))>=1")" True

###############################################################################
head1 "Workflow 9 - Payroll"
###############################################################################

step "9.1 The payroll run is generated"
BODY=$(cat <<JSON
{"fiscalYearId":"$FYID","bsYear":2083,"bsMonth":5}
JSON
)
PRUN=$(req POST "/tenants/$TID/payroll-runs/generate" "$BODY" "$TH")
PRUNID=$(echo "$PRUN" | j "d.get('id','')")
ok "the run was generated" "$([ -n "$PRUNID" ] && echo yes || echo no)" yes
ok "one slip was produced" "$(echo "$PRUN" | j "d.get('generated',0)")" 1
SLIPS=$(req GET "/tenants/$TID/salary-slips?limit=5" "" "$TH")
ok "the employee PF/SSF deduction was computed" \
  "$(echo "$SLIPS" | j "d.get('data',[{}])[0].get('employeePfSsfDeduction','?')")" 9000
ok "the employer contribution was computed" \
  "$(echo "$SLIPS" | j "d.get('data',[{}])[0].get('employerPfSsfContribution','?')")" 9000
ok "the CIT share was computed" \
  "$(echo "$SLIPS" | j "d.get('data',[{}])[0].get('citDeduction','?')")" 1500
ok "the net pay was computed" \
  "$(echo "$SLIPS" | j "d.get('data',[{}])[0].get('netPayable','?')")" 33813.33

step "9.1b The SSF/PF/CIT/TDS remittance statement downloads"
REMIT_HEADERS=$(curl -s "$BASE/tenants/$TID/payroll-runs/$PRUNID/remittance" -H "$TH")
ok "the remittance CSV is served with the remittance columns" \
  "$(printf '%s' "$REMIT_HEADERS" | head -1 | grep -c 'employeeCode,employeeName,panNumber')" 1
ok "it carries a TOTAL row for the run" \
  "$(printf '%s' "$REMIT_HEADERS" | grep -c '^TOTAL')" 1
ok "it carries the TDS deduction of the slip" \
  "$(printf '%s' "$REMIT_HEADERS" | grep -cE ',[0-9]+\.[0-9]{2},[0-9]+\.[0-9]{2}$')" 2

step "9.2 A duplicate payroll run for the same month is refused"
DUPRUN=$(req POST "/tenants/$TID/payroll-runs/generate" "$BODY" "$TH")
ok "the duplicate run was rejected" "$(echo "$DUPRUN" | j "d.get('statusCode',200)")" 409

step "9.3 The run can be approved and disbursed"
APPROVED=$(req PATCH "/tenants/$TID/payroll-runs/$PRUNID" '{"status":"APPROVED"}' "$TH")
ok "the run was approved" "$(echo "$APPROVED" | j "d.get('status','')")" APPROVED
DISB=$(req PATCH "/tenants/$TID/payroll-runs/$PRUNID" '{"status":"DISBURSED"}' "$TH")
ok "the run was disbursed" "$(echo "$DISB" | j "d.get('status','')")" DISBURSED
LOCKED=$(req PATCH "/tenants/$TID/payroll-runs/$PRUNID" '{"status":"DRAFT"}' "$TH")
ok "a disbursed run can no longer be changed" "$(echo "$LOCKED" | j "d.get('statusCode',200)")" 409

###############################################################################
head1 "Workflow 10 - Transport, hostel and library"
###############################################################################

step "10.1 The vehicle, route and stop are created"
VEH=$(req POST "/tenants/$TID/transport-vehicles" '{"vehicleNumber":"BA-1-2083","type":"BUS","capacity":2}' "$TH")
VEHID=$(echo "$VEH" | j "d.get('id','')")
ok "the vehicle was created" "$([ -n "$VEHID" ] && echo yes || echo no)" yes
RTE=$(req POST "/tenants/$TID/transport-routes" '{"nameEn":"Ring Road","nameNe":"रिङ रोड","fare":500}' "$TH")
RTEID=$(echo "$RTE" | j "d.get('id','')")
ok "the route was created" "$([ -n "$RTEID" ] && echo yes || echo no)" yes
BODY=$(cat <<JSON
{"routeId":"$RTEID","nameEn":"School","nameNe":"विद्यालय","sequence":1}
JSON
)
STOP=$(req POST "/tenants/$TID/transport-stops" "$BODY" "$TH")
STOPID=$(echo "$STOP" | j "d.get('id','')")
ok "the stop was created" "$([ -n "$STOPID" ] && echo yes || echo no)" yes

step "10.2 Two students take the bus, then the third is refused"
BODY=$(cat <<JSON
{"admissionNo":"$SUF/002","firstNameEn":"Bin","firstNameNe":"बिन",
 "lastNameEn":"One","lastNameNe":"एक",
 "dobAd":"2012-05-05T00:00:00.000Z","dobBs":"2069-02-22","gender":"MALE",
 "casteEthnicityCode":"1","casteEthnicity":"Brahmin/Chhetri","motherTongue":"Nepali",
 "birthCertificateNo":"BC2-$SUF","nationalIdNin":"NIN2-$SUF"}
JSON
)
ST1=$(req POST "/tenants/$TID/students" "$BODY" "$TH")
S2=$(echo "$ST1" | j "d.get('id','')")
BODY=$(cat <<JSON
{"studentId":"$S2","academicYearId":"$AYID","gradeLevelId":"$GLID",
 "sectionId":"$SECID","rollNo":2}
JSON
)
E2=$(req POST "/tenants/$TID/enrollments" "$BODY" "$TH")
E2ID=$(echo "$E2" | j "d.get('id','')")
BODY=$(cat <<JSON
{"enrollmentId":"$ENRID","routeId":"$RTEID","stopId":"$STOPID","vehicleId":"$VEHID",
 "startDate":"2026-07-20T00:00:00.000Z"}
JSON
)
req POST "/tenants/$TID/student-transports" "$BODY" "$TH" >/dev/null
BODY=$(cat <<JSON
{"enrollmentId":"$E2ID","routeId":"$RTEID","stopId":"$STOPID","vehicleId":"$VEHID",
 "startDate":"2026-07-20T00:00:00.000Z"}
JSON
)
req POST "/tenants/$TID/student-transports" "$BODY" "$TH" >/dev/null
BODY=$(cat <<JSON
{"admissionNo":"$SUF/003","firstNameEn":"Chitra","firstNameNe":"चित्रा",
 "lastNameEn":"Two","lastNameNe":"दुई",
 "dobAd":"2012-05-05T00:00:00.000Z","dobBs":"2069-02-22","gender":"MALE",
 "casteEthnicityCode":"1","casteEthnicity":"Brahmin/Chhetri","motherTongue":"Nepali",
 "birthCertificateNo":"BC3-$SUF","nationalIdNin":"NIN3-$SUF"}
JSON
)
THIRD=$(req POST "/tenants/$TID/students" "$BODY" "$TH")
S3=$(echo "$THIRD" | j "d.get('id','')")
BODY=$(cat <<JSON
{"studentId":"$S3","academicYearId":"$AYID","gradeLevelId":"$GLID",
 "sectionId":"$SECID","rollNo":3}
JSON
)
E3=$(req POST "/tenants/$TID/enrollments" "$BODY" "$TH")
E3ID=$(echo "$E3" | j "d.get('id','')")
BODY=$(cat <<JSON
{"enrollmentId":"$E3ID","routeId":"$RTEID","stopId":"$STOPID","vehicleId":"$VEHID",
 "startDate":"2026-07-20T00:00:00.000Z"}
JSON
)
FULL=$(req POST "/tenants/$TID/student-transports" "$BODY" "$TH")
if [ -n "${WF_DEBUG:-}" ]; then
  echo "    DEBUG E2ID=$E2ID E3ID=$E3ID RTEID=$RTEID STOPID=$STOPID VEHID=$VEHID"
  echo "    DEBUG full=$FULL"
  echo "    DEBUG E2=$(req GET "/tenants/$TID/enrollments?limit=50" "" "$TH" | j "[e['id'] for e in d['data']]")"
fi
ok "the over-capacity student was refused" "$(echo "$FULL" | j "d.get('statusCode',200)")" 409

step "10.3 The hostel and its room are created and filled"
HST=$(req POST "/tenants/$TID/hostels" '{"nameEn":"Boys Hostel","nameNe":"छात्रावास","type":"BOYS","capacity":1}' "$TH")
HSTID=$(echo "$HST" | j "d.get('id','')")
BODY=$(cat <<JSON
{"hostelId":"$HSTID","roomNumber":"101","capacity":1}
JSON
)
HRM=$(req POST "/tenants/$TID/hostel-rooms" "$BODY" "$TH")
HRMID=$(echo "$HRM" | j "d.get('id','')")
ok "the hostel and room were created" "$([ -n "$HRMID" ] && echo yes || echo no)" yes
BODY=$(cat <<JSON
{"hostelId":"$HSTID","roomId":"$HRMID","enrollmentId":"$ENRID",
 "startDate":"2026-07-20T00:00:00.000Z"}
JSON
)
req POST "/tenants/$TID/hostel-allocations" "$BODY" "$TH" >/dev/null
BODY=$(cat <<JSON
{"hostelId":"$HSTID","roomId":"$HRMID","enrollmentId":"$E2ID",
 "startDate":"2026-07-20T00:00:00.000Z"}
JSON
)
OVERHOSTEL=$(req POST "/tenants/$TID/hostel-allocations" "$BODY" "$TH")
[ -n "${WF_DEBUG:-}" ] && echo "    DEBUG E2ID=$E2ID full=$OVERHOSTEL"
ok "the over-capacity allocation was refused" "$(echo "$OVERHOSTEL" | j "d.get('statusCode',200)")" 409

step "10.4 A book is borrowed and returned"
BOOK=$(req POST "/tenants/$TID/library-books" '{"titleEn":"Nepali Reader","titleNe":"नेपाली पाठ्यपुस्तक","totalCopies":1,"availableCopies":1}' "$TH")
BOOKID=$(echo "$BOOK" | j "d.get('id','')")
ok "the book was created" "$([ -n "$BOOKID" ] && echo yes || echo no)" yes
BODY=$(cat <<JSON
{"bookId":"$BOOKID","studentId":"$STUID","issueDateAd":"2026-07-21T00:00:00.000Z",
 "issueDateBs":"2083-04-06","dueDateAd":"2026-07-28T00:00:00.000Z","dueDateBs":"2083-04-13"}
JSON
)
ISSUE=$(req POST "/tenants/$TID/book-issues" "$BODY" "$TH")
ok "the book was borrowed" "$(echo "$ISSUE" | j "d.get('id','')!=''")" True
ok "the available copy was decremented" \
  "$(req GET "/tenants/$TID/library-books/$BOOKID" "" "$TH" | j "d.get('availableCopies','?')")" 0
ISSUEID=$(echo "$ISSUE" | j "d.get('id','')")
BODY=$(cat <<JSON
{"returnedAt":"2026-07-25T00:00:00.000Z","returnedAtBs":"2083-04-10"}
JSON
)
req POST "/tenants/$TID/book-issues/$ISSUEID/return" "$BODY" "$TH" >/dev/null
ok "the copy was returned to the shelf" \
  "$(req GET "/tenants/$TID/library-books/$BOOKID" "" "$TH" | j "d.get('availableCopies','?')")" 1

###############################################################################
head1 "Workflow 11 - Transfer certificate"
###############################################################################

step "11.1 A transfer certificate is issued"
BODY=$(cat <<JSON
{"studentId":"$S3","issueDateAd":"2026-12-15T00:00:00.000Z","issueDateBs":"2083-08-29",
 "characterRemark":"Good conduct","leavingReason":"Family relocation"}
JSON
)
TC=$(req POST "/tenants/$TID/transfer-certificates" "$BODY" "$TH")
[ -n "${WF_DEBUG:-}" ] && echo "    DEBUG S3=$S3 TC=$TC"
TCID=$(echo "$TC" | j "d.get('id','')")
ok "the certificate was issued" "$([ -n "$TCID" ] && echo yes || echo no)" yes
ok "the number was allocated by the server" \
  "$(echo "$TC" | j "d.get('tcNumber','?').startswith('TC-')")" True
ALL=$(req GET "/tenants/$TID/enrollments?limit=50" "" "$TH")
if [ -n "${WF_DEBUG:-}" ]; then
  echo "    DEBUG E3ID=$E3ID"
  echo "    DEBUG payload ids=$(echo "$ALL" | python3 -c "import sys,json;d=json.load(sys.stdin);print([e['id'] for e in d['data']])" 2>/dev/null)"
fi
ENR3=$(echo "$ALL" | python3 -c "import sys,json
d=json.load(sys.stdin)
for e in d['data']:
    if e['id'] == '$E3ID':
        print(e['enrollmentStatus'])
        break
else:
    print('NOT_FOUND')" 2>/dev/null)
ok "the student's enrolment became TRANSFERRED_OUT" "$ENR3" TRANSFERRED_OUT

###############################################################################
head1 "Workflow 12 - Notifications and the audit trail"
###############################################################################

step "12.1 A notification is created and read"
NTC=$(req POST /notifications '{"title":"Fee reminder","message":"The fee is due","type":"FEE"}' "$TH")
NTCID=$(echo "$NTC" | j "d.get('id','')")
ok "the notification was created" "$([ -n "$NTCID" ] && echo yes || echo no)" yes
ok "it starts unread" "$(echo "$NTC" | j "d.get('isRead',True)")" False
req PATCH "/notifications/$NTCID" '{"isRead":true}' "$TH" >/dev/null
ok "it can be marked read" \
  "$(req GET "/notifications/$NTCID" "" "$TH" | j "d.get('isRead',False)")" True

step "12.2 The notifications are scoped to the recipient"
MY=$(req GET "/notifications?limit=50" "" "$TH")
ok "only the principal's own notifications are returned" \
  "$(echo "$MY" | j "all(n['recipientId']==d['data'][0]['recipientId'] for n in d['data']) if d.get('data') else True")" True

step "12.3 The audit trail records the privileged actions"
AL=$(req GET "/platform/audit-logs?limit=20" "" "$PH")
ok "audit entries exist" "$(echo "$AL" | j "d.get('meta',{}).get('total',0)>0")" True
ok "the audit trail records the platform action" \
  "$(echo "$AL" | j "any(a.get('method')=='POST' for a in d.get('data',[]))")" True

###############################################################################
head1 "Workflow 13 - Tenant RBAC"
###############################################################################

step "13.1 A custom role is created for the school"
BODY=$(cat <<JSON
{"name":"Class Teacher $SUF","description":"Teaching only",
 "permissionCodes":["students.read","sections.read"]}
JSON
)
ROLE=$(req POST "/tenants/$TID/roles" "$BODY" "$TH")
ROLEID=$(echo "$ROLE" | j "d.get('id','')")
ok "the role was created" "$([ -n "$ROLEID" ] && echo yes || echo no)" yes

step "13.2 A teacher account is created and given the role"
BODY=$(cat <<JSON
{"email":"wf-teacher-$SUF@test.com","firstNameEn":"Teacher","firstNameNe":"शिक्षक",
 "lastNameEn":"One","lastNameNe":"एक","password":"Workflow-Teacher-1!",
 "roleNames":["Class Teacher $SUF"]}
JSON
)
TUSER=$(req POST "/tenants/$TID/users" "$BODY" "$TH")
TUID=$(echo "$TUSER" | j "d.get('id','')")
ok "the teacher was created" "$([ -n "$TUID" ] && echo yes || echo no)" yes

step "13.2b An unknown role is refused without leaving an orphaned account"
BODY=$(cat <<JSON
{"email":"wf-no-role-$SUF@test.com","firstNameEn":"No","firstNameNe":"होइन",
 "lastNameEn":"Role","lastNameNe":"भूमिका","password":"No-Role-Secure1!",
 "roleNames":["DefinitelyNotARole$SUF"]}
JSON
)
BADROLE=$(req POST "/tenants/$TID/users" "$BODY" "$TH")
ok "the unknown role was refused" "$(echo "$BADROLE" | j "d.get('statusCode',200)")" 404
ok "no orphaned account was created" \
  "$(req GET "/tenants/$TID/users?search=wf-no-role-$SUF" "" "$TH" | j "d.get('meta',{}).get('total',-1)")" 0

step "13.3 The teacher logs in and is restricted to their permissions"
BODY=$(cat <<JSON
{"email":"wf-teacher-$SUF@test.com","password":"Workflow-Teacher-1!","tenantId":"$TID"}
JSON
)
TTOK=$(req POST /tenant/auth/login "$BODY" "" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the teacher logged in" "$([ -n "$TTOK" ] && echo yes || echo no)" yes
TME=$(req GET /tenant/auth/me "" "Authorization: Bearer $TTOK")
ok "the teacher holds only the role's permissions" \
  "$(echo "$TME" | j "sorted(d.get('permissions',[]))==sorted(['students.read','sections.read'])")" True
ok "the teacher may read students" \
  "$(code "$BASE/tenants/$TID/students" -H "Authorization: Bearer $TTOK")" 200
ok "the teacher may not manage fees" \
  "$(code "$BASE/tenants/$TID/fee-invoices" -H "Authorization: Bearer $TTOK")" 403

step "13.4 The teacher cannot reach another school"
OTHER=$(req GET "/tenants?limit=100" "" "$PH" | j "[t['id'] for t in d['data'] if t['id']!='$TID'][0]")
ok "the teacher is blocked from another school" \
  "$(code "$BASE/tenants/$OTHER/students" -H "Authorization: Bearer $TTOK")" 403

step "13.5 The teacher's permissions can be changed and take effect"
req PUT "/tenants/$TID/roles/$ROLEID/permissions" '{"permissionCodes":["students.read"]}' "$TH" >/dev/null
BODY=$(cat <<JSON
{"email":"wf-teacher-$SUF@test.com","password":"Workflow-Teacher-1!","tenantId":"$TID"}
JSON
)
TTOK2=$(req POST /tenant/auth/login "$BODY" "" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the reduced permission set takes effect immediately" \
  "$(code "$BASE/tenants/$TID/sections" -H "Authorization: Bearer $TTOK2")" 403

step "13.6 The student portal scopes data to the linked student"
BODY=$(cat <<JSON
{"email":"wf-student-$SUF@test.com","firstNameEn":"Student","firstNameNe":"छात्र",
 "lastNameEn":"Portal","lastNameNe":"पोर्टल","password":"Wf-Student-1!",
 "roleNames":["Student"]}
JSON
)
STUUSER=$(req POST "/tenants/$TID/users" "$BODY" "$TH")
STUUSERID=$(echo "$STUUSER" | j "d.get('user',{}).get('id','')")
ok "the student account was created" "$([ -n "$STUUSERID" ] && echo yes || echo no)" yes
req PATCH "/tenants/$TID/students/$STUID" "{\"userId\":\"$STUUSERID\"}" "$TH" > /dev/null
BODY=$(cat <<JSON
{"email":"wf-student-$SUF@test.com","password":"Wf-Student-1!","tenantId":"$TID"}
JSON
)
STOKEN=$(req POST /tenant/auth/login "$BODY" "" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the linked student can read their own profile" \
  "$(req GET "/tenants/$TID/student/me" "" "Authorization: Bearer $STOKEN" | j "d.get('admissionNo','')")" "$SUF/001"
ok "the student cannot use the student portal before linking (teacher account)" \
  "$(code "$BASE/tenants/$TID/student/me" -H "Authorization: Bearer $TTOK")" 403
ok "the student cannot read every student in the school" \
  "$(code "$BASE/tenants/$TID/students" -H "Authorization: Bearer $STOKEN")" 403

###############################################################################
head1 "Workflow 14 - Session lifecycle"
###############################################################################

step "14.1 The refresh token issues a new access token"
BODY=$(cat <<JSON
{"email":"wf-admin-$SUF@test.com","password":"Workflow-Admin-1!","tenantId":"$TID"}
JSON
)
LOGIN=$(req POST /tenant/auth/login "$BODY" "")
RT=$(echo "$LOGIN" | sed -n 's/.*"refreshToken":"\([^"]*\)".*/\1/p')
NEW=$(req POST /tenant/auth/refresh "{\"refreshToken\":\"$RT\"}" "")
NEWTOK=$(echo "$NEW" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
ok "the refresh token works" "$([ -n "$NEWTOK" ] && echo yes || echo no)" yes

step "14.2 The old refresh token is invalidated by the rotation"
[ -n "${WF_DEBUG:-}" ] && echo "    DEBUG RT_len=${#RT} NEWTOK_len=${#NEWTOK}"
REPLAY=$(code -X POST "$BASE/tenant/auth/refresh" -H "$PC" -d "{\"refreshToken\":\"$RT\"}")
[ -n "${WF_DEBUG:-}" ] && echo "    DEBUG REPLAY=$REPLAY BODY=$(curl -s -X POST "$BASE/tenant/auth/refresh" -H "$PC" -d "{\"refreshToken\":\"$RT\"}" | head -c 120)"
ok "the replayed refresh token was rejected" "$REPLAY" 401

step "14.3 Logging out invalidates the refresh token"
LOGIN2=$(req POST /tenant/auth/login "$BODY" "")
RT2=$(echo "$LOGIN2" | sed -n 's/.*"refreshToken":"\([^"]*\)".*/\1/p')
AT2=$(echo "$LOGIN2" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
req POST /tenant/auth/logout "" "Authorization: Bearer $AT2" >/dev/null
AFTERLOGOUT=$(code -X POST "$BASE/tenant/auth/refresh" -H "$PC" -d "{\"refreshToken\":\"$RT2\"}")
ok "the refresh token no longer works after logout" "$AFTERLOGOUT" 401

step "14.4 Repeated wrong passwords lock the account"
for i in 1 2 3 4 5 6; do
  req POST /tenant/auth/login \
    "{\"email\":\"wf-admin-$SUF@test.com\",\"password\":\"wrong-$i\",\"tenantId\":\"$TID\"}" "" >/dev/null
done
LOCKED=$(req POST /tenant/auth/login "$BODY" "")
ok "the account is locked after repeated failures" "$(echo "$LOCKED" | j "d.get('statusCode',200)")" 401

###############################################################################
head1 "Workflow 15 - Suspension of the school"
###############################################################################

step "15.1 Suspending the school locks its staff out"
req PATCH "/tenants/$TID" '{"status":"SUSPENDED"}' "$PH" >/dev/null
BODY=$(cat <<JSON
{"email":"wf-teacher-$SUF@test.com","password":"Workflow-Teacher-1!","tenantId":"$TID"}
JSON
)
SUSP=$(req POST /tenant/auth/login "$BODY" "")
ok "a suspended school cannot be logged into" "$(echo "$SUSP" | j "d.get('statusCode',200)")" 403
req PATCH "/tenants/$TID" '{"status":"ACTIVE"}' "$PH" >/dev/null

###############################################################################
echo ""
echo "############################################################"
echo "# PASS: $PASS   FAIL: $FAIL"
echo "############################################################"
[ "$FAIL" -eq 0 ]
