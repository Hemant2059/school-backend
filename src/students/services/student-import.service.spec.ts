import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StudentImportService } from './student-import.service.js';

function makePrisma() {
  return {
    student: {
      findMany: vi.fn(async () => []),
      create: vi.fn(async ({ data }: any) =>
        Promise.resolve({ id: 'new-id', ...data }),
      ),
    },
  } as any;
}

const HEADER =
  'admissionNo,firstNameEn,firstNameNe,lastNameEn,lastNameNe,dobAd,dobBs,gender,casteEthnicityCode,casteEthnicity,motherTongue,birthCertificateNo,nationalIdNin';

function csv(...lines: string[]) {
  return [HEADER, ...lines].join('\n');
}

describe('StudentImportService', () => {
  let prisma: any;
  let service: StudentImportService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new StudentImportService(prisma);
  });

  it('rejects an empty CSV body', async () => {
    await expect(service.importCsv('t1', '  ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates valid rows and reports invalid ones without aborting', async () => {
    const result = await service.importCsv(
      't1',
      csv(
        'IMP-1,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-05-05,2070-02-22,FEMALE,1,Brahmin/Chhetri,Nepali,BC-1,NIN-1',
        'IMP-2,Ram,राम,Bahadur,बहादुर,2013-06-01,2070-03-18,MALE,1,Brahmin/Chhetri,Nepali,BC-2,NIN-2',
        'IMP-3,Bad,खराब,Dob,मिति,2013-13-40,2070-04-01,FEMALE,1,Brahmin/Chhetri,Nepali,BC-3,NIN-3',
        'IMP-4,Bad,खराब,Gender,लिङ्ग,2013-07-01,2070-04-17,ALIEN,1,Brahmin/Chhetri,Nepali,BC-4,NIN-4',
      ),
    );

    expect(result.total).toBe(4);
    expect(result.created).toBe(2);
    expect(result.errors).toHaveLength(2);
    expect(result.errors.map((e) => e.line)).toEqual([4, 5]);
  });

  it('skips admission numbers that already exist for the tenant', async () => {
    prisma.student.findMany.mockResolvedValue([{ admissionNo: 'IMP-1' }]);
    const result = await service.importCsv(
      't1',
      csv(
        'IMP-1,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-05-05,2070-02-22,FEMALE,1,Brahmin/Chhetri,Nepali,BC-1,NIN-1',
      ),
    );
    expect(result.created).toBe(0);
    expect(result.duplicates).toBe(1);
  });

  it('skips repeated admission numbers inside the same file', async () => {
    const result = await service.importCsv(
      't1',
      csv(
        'IMP-1,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-05-05,2070-02-22,FEMALE,1,Brahmin/Chhetri,Nepali,BC-1,NIN-1',
        'IMP-1,Copy,कपी,Copy,कपी,2013-05-06,2070-02-23,FEMALE,1,Brahmin/Chhetri,Nepali,BC-2,NIN-2',
      ),
    );
    expect(result.created).toBe(1);
    expect(result.duplicates).toBe(1);
  });

  it('is case-insensitive on the header and gender', async () => {
    const result = await service.importCsv(
      't1',
      [
        'ADMISSIONNO,FIRSTNAMEEN,FIRSTNAMENE,LASTNAMEEN,LASTNAMENE,DOBAD,DOBBS,GENDER,CASTEETHNICITYCODE,CASTEETHNICITY,MOTHERTONGUE,BIRTHCERTIFICATENO,NATIONALIDNIN',
        'IMP-9,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-05-05,2070-02-22,female,1,Brahmin/Chhetri,Nepali,BC-9,NIN-9',
      ].join('\n'),
    );
    expect(result.created).toBe(1);
    expect(result.errors).toEqual([]);
  });

  it('rejects impossible calendar dates like 2013-02-31', async () => {
    const result = await service.importCsv(
      't1',
      csv(
        'IMP-7,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-02-31,2070-02-22,FEMALE,1,Brahmin/Chhetri,Nepali,BC-7,NIN-7',
      ),
    );
    expect(result.created).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toMatch(/real calendar date/);
  });

  it('keeps importing valid rows when a later row fails the insert', async () => {
    prisma.student.create
      .mockResolvedValueOnce({ id: 'ok-1' })
      .mockRejectedValueOnce(new Error('unique constraint violated'));
    const result = await service.importCsv(
      't1',
      csv(
        'IMP-10,Anna,अन्ना,Shrestha,श्रेष्ठ,2013-05-05,2070-02-22,FEMALE,1,Brahmin/Chhetri,Nepali,BC-10,NIN-10',
        'IMP-11,Ram,राम,Bahadur,बहादुर,2013-06-01,2070-03-18,MALE,1,Brahmin/Chhetri,Nepali,BC-11,NIN-11',
      ),
    );
    expect(result.created).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].line).toBe(3);
  });
});
