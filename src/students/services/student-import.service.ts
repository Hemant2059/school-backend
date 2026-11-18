import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { csvToRecords } from '../../common/utils/csv.js';

type GenderId = 'MALE' | 'FEMALE' | 'OTHER';
type DisabilityId =
  | 'NONE'
  | 'PHYSICAL'
  | 'MENTAL'
  | 'DEAF'
  | 'BLIND'
  | 'LOW_VISION'
  | 'DEAF_BLIND'
  | 'SPEECH'
  | 'INTELLECTUAL'
  | 'AUTISM'
  | 'MULTIPLE';

interface NewStudent {
  tenantId: string;
  admissionNo: string;
  iemisStudentId: string | null;
  nebRegistrationNo: string | null;
  symbolNo: string | null;
  firstNameEn: string;
  firstNameNe: string;
  middleNameEn: string | null;
  middleNameNe: string | null;
  lastNameEn: string;
  lastNameNe: string;
  dobAd: Date;
  dobBs: string;
  gender: GenderId;
  casteEthnicityCode: string;
  casteEthnicity: string;
  disabilityType: DisabilityId;
  motherTongue: string;
  bloodGroup: string | null;
  birthCertificateNo: string;
  nationalIdNin: string;
  hadEcdExperience: boolean;
}

const GENDERS = new Set(['MALE', 'FEMALE', 'OTHER']);
const DISABILITIES = new Set([
  'NONE',
  'PHYSICAL',
  'MENTAL',
  'DEAF',
  'BLIND',
  'LOW_VISION',
  'DEAF_BLIND',
  'SPEECH',
  'INTELLECTUAL',
  'AUTISM',
  'MULTIPLE',
]);
const TRUTHY = new Set(['true', 'yes', '1']);

export interface StudentImportError {
  line: number;
  message: string;
}

/**
 * Bulk student admission from CSV — the way a school onboards a whole
 * batch of students instead of typing them one by one.
 *
 * Expected header (case-insensitive):
 *   admissionNo,firstNameEn,firstNameNe,lastNameEn,lastNameNe,dobAd,dobBs,
 *   gender,casteEthnicityCode,casteEthnicity,motherTongue,
 *   birthCertificateNo,nationalIdNin
 *   [,middleNameEn,middleNameNe,iemisStudentId,nebRegistrationNo,symbolNo,
 *    bloodGroup,disabilityType,hadEcdExperience]
 *
 * Rows failing validation are reported by line number and never abort the
 * import. Rows whose admissionNo already exists for this tenant (or is
 * repeated inside the file) are counted as duplicates and skipped.
 */
@Injectable()
export class StudentImportService {
  constructor(private readonly prisma: PrismaService) {}

  async importCsv(tenantId: string, csv: string) {
    if (!csv || !csv.trim()) {
      throw new BadRequestException('CSV body is empty');
    }

    let records;
    try {
      records = csvToRecords(csv, { maxRows: 2001 });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid CSV',
      );
    }
    if (records.length === 0) {
      throw new BadRequestException('CSV contains no data rows');
    }
    if (records.length > 2000) {
      throw new BadRequestException('CSV exceeds the 2000 row limit');
    }

    // Existing admission numbers (case-insensitive) for duplicate detection.
    const existing = await this.prisma.student.findMany({
      where: { tenantId, deletedAt: null },
      select: { admissionNo: true },
    });
    const existingAdmission = new Set(
      existing.map((s) => s.admissionNo.toLowerCase()),
    );

    const truthy = TRUTHY;
    const errors: StudentImportError[] = [];
    const valid: Array<{ line: number; data: NewStudent }> = [];

    const seenInFile = new Set<string>();
    let duplicates = 0;

    for (const record of records) {
      const v = record.values;
      const line = record.line;

      const admissionNo = (v['admissionno'] ?? '').slice(0, 40);
      if (!admissionNo) {
        errors.push({ line, message: 'admissionNo is required' });
        continue;
      }
      const admissionKey = admissionNo.toLowerCase();
      if (existingAdmission.has(admissionKey) || seenInFile.has(admissionKey)) {
        duplicates++;
        continue;
      }

      const firstNameEn = v['firstnameen'] ?? '';
      const firstNameNe = v['firstnamene'] ?? '';
      const lastNameEn = v['lastnameen'] ?? '';
      const lastNameNe = v['lastnamene'] ?? '';
      let namesValid = true;
      for (const [field, value] of [
        ['firstNameEn', firstNameEn],
        ['firstNameNe', firstNameNe],
        ['lastNameEn', lastNameEn],
        ['lastNameNe', lastNameNe],
      ] as const) {
        if (!value || value.length > 120) {
          errors.push({
            line,
            message: `${field} is required (max 120 chars)`,
          });
          namesValid = false;
        }
      }
      if (!namesValid) continue;

      const rawDob = v['dobad'] ?? '';
      const dobMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(rawDob);
      if (!dobMatch) {
        errors.push({
          line,
          message: `dobAd must be YYYY-MM-DD, got "${rawDob}"`,
        });
        continue;
      }
      const [, ys, ms, ds] = dobMatch;
      const dobAd = new Date(Date.UTC(Number(ys), Number(ms) - 1, Number(ds)));
      if (dobAd.toISOString().slice(0, 10) !== rawDob) {
        errors.push({
          line,
          message: `dobAd is not a real calendar date: "${rawDob}"`,
        });
        continue;
      }

      const dobBs = (v['dobbs'] ?? '').slice(0, 10);
      if (!dobBs) {
        errors.push({ line, message: 'dobBs is required (e.g. 2067-09-17)' });
        continue;
      }

      const gender = (v['gender'] ?? '').toUpperCase();
      if (!GENDERS.has(gender)) {
        errors.push({
          line,
          message: `gender must be MALE, FEMALE or OTHER, got "${v['gender']}"`,
        });
        continue;
      }

      const casteEthnicityCode = v['casteethnicitycode'] ?? '';
      const casteEthnicity = v['casteethnicity'] ?? '';
      if (!casteEthnicityCode || casteEthnicityCode.length > 40) {
        errors.push({
          line,
          message: 'casteEthnicityCode is required (max 40 chars)',
        });
        continue;
      }
      if (!casteEthnicity || casteEthnicity.length > 80) {
        errors.push({
          line,
          message: 'casteEthnicity is required (max 80 chars)',
        });
        continue;
      }

      const motherTongue = v['mothertongue'] ?? '';
      if (!motherTongue || motherTongue.length > 60) {
        errors.push({
          line,
          message: 'motherTongue is required (max 60 chars)',
        });
        continue;
      }

      const birthCertificateNo = v['birthcertificateno'] ?? '';
      if (!birthCertificateNo || birthCertificateNo.length > 40) {
        errors.push({
          line,
          message: 'birthCertificateNo is required (max 40 chars)',
        });
        continue;
      }
      const nationalIdNin = v['nationalidnin'] ?? '';
      if (!nationalIdNin || nationalIdNin.length > 40) {
        errors.push({
          line,
          message: 'nationalIdNin is required (max 40 chars)',
        });
        continue;
      }

      const rawDisability =
        (v['disabilitytype'] ?? 'NONE').toUpperCase() || 'NONE';
      if (!DISABILITIES.has(rawDisability)) {
        errors.push({
          line,
          message: `disabilityType must be one of ${[...DISABILITIES].join('/')}; got "${v['disabilitytype']}"`,
        });
        continue;
      }

      seenInFile.add(admissionKey);
      valid.push({
        line,
        data: {
          tenantId,
          admissionNo,
          iemisStudentId: (v['iemisstudentid'] ?? '').slice(0, 20) || null,
          nebRegistrationNo:
            (v['nebregistrationno'] ?? '').slice(0, 40) || null,
          symbolNo: (v['symbolno'] ?? '').slice(0, 40) || null,
          firstNameEn,
          firstNameNe,
          middleNameEn: v['middlenameen'] || null,
          middleNameNe: v['middlenamene'] || null,
          lastNameEn,
          lastNameNe,
          dobAd,
          dobBs,
          gender: gender as GenderId,
          casteEthnicityCode,
          casteEthnicity,
          disabilityType: rawDisability as DisabilityId,
          motherTongue,
          bloodGroup: (v['bloodgroup'] ?? '').slice(0, 10) || null,
          birthCertificateNo,
          nationalIdNin,
          hadEcdExperience: truthy.has(
            (v['hadecdexperience'] ?? '').toLowerCase(),
          ),
        },
      });
    }

    let created = 0;
    for (const row of valid) {
      try {
        await this.prisma.student.create({ data: row.data });
        created++;
      } catch (error) {
        errors.push({
          line: row.line,
          message:
            error instanceof Error
              ? error.message.slice(0, 200)
              : 'Insert failed',
        });
      }
    }

    return { total: records.length, created, duplicates, errors };
  }
}
