-- The staff member's agreed monthly package.
--
-- The payroll engine needs a source for the gross salary. Previously the
-- only place a salary could live was a SalarySlip, which made it impossible
-- to generate the first run: the run needs a basic salary and the basic
-- salary was derived from the slips.
ALTER TABLE "StaffProfile"
  ADD COLUMN "basicSalary" DECIMAL(12,2),
  ADD COLUMN "gradeAllowance" DECIMAL(12,2),
  ADD COLUMN "dearnessAllowance" DECIMAL(12,2);

-- A salary must never be negative.
ALTER TABLE "StaffProfile"
  ADD CONSTRAINT "StaffProfile_salary_check" CHECK (
    ("basicSalary" IS NULL OR "basicSalary" >= 0)
    AND ("gradeAllowance" IS NULL OR "gradeAllowance" >= 0)
    AND ("dearnessAllowance" IS NULL OR "dearnessAllowance" >= 0)
  );
