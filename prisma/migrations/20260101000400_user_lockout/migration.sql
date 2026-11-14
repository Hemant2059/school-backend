-- Brute-force protection for the school login.
--
-- The platform account already had these columns; the school account did
-- not, so `/tenant/auth/login` could be guessed against without limit.
ALTER TABLE "User"
  ADD COLUMN "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3);
