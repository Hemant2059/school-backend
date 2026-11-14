-- CreateEnum
CREATE TYPE "StaffCategory" AS ENUM ('TEACHING', 'NON_TEACHING_ADMIN', 'SUPPORT_DRIVER_HELPER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('GOVT_PERMANENT', 'GOVT_TEMPORARY', 'RAHAT_GRANT', 'LOCAL_LEVEL_GRANT', 'PRIVATE_SOURCE', 'ECD_FACILITATOR');

-- CreateEnum
CREATE TYPE "TeacherTrainingStatus" AS ENUM ('TPD_COMPLETED', 'PARTIAL', 'UNTRAINED');

-- CreateEnum
CREATE TYPE "MaritalStatusForTax" AS ENUM ('SINGLE', 'MARRIED');

-- AlterTable
ALTER TABLE "StaffProfile" DROP COLUMN "designation",
ADD COLUMN     "bankAccountNo" TEXT,
ADD COLUMN     "casteEthnicity" TEXT,
ADD COLUMN     "casteEthnicityCode" TEXT,
ADD COLUMN     "citNumber" TEXT,
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "iemisTeacherId" TEXT,
ADD COLUMN     "maritalStatusForTax" "MaritalStatusForTax",
ADD COLUMN     "middleNameEn" TEXT,
ADD COLUMN     "middleNameNe" TEXT,
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "pfNumber" TEXT,
ADD COLUMN     "ssfNumber" TEXT,
ADD COLUMN     "staffCategory" "StaffCategory",
ADD COLUMN     "teacherTrainingStatus" "TeacherTrainingStatus",
ADD COLUMN     "teachingLicenseNo" TEXT;
