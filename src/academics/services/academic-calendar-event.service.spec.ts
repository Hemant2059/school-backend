import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AcademicCalendarEventService } from './academic-calendar-event.service.js';

function makePrisma() {
  const tx: any[] = [];
  return {
    academicYear: { findFirst: vi.fn() },
    academicCalendarEvent: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((operations: any[]) => {
      tx.push(...operations);
      return Promise.all(operations);
    }),
    __tx: tx,
  } as any;
}

const AY = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

function csv(...lines: string[]) {
  return ['dateAd,dateBs,titleEn,titleNe,isHoliday', ...lines].join('\n');
}

describe('AcademicCalendarEventService.importCsv', () => {
  let prisma: any;
  let service: AcademicCalendarEventService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new AcademicCalendarEventService(prisma);
    prisma.academicYear.findFirst.mockResolvedValue({ id: AY, tenantId: 't1' });
    prisma.academicCalendarEvent.findMany.mockResolvedValue([]);
    prisma.academicCalendarEvent.create.mockImplementation(({ data }: any) =>
      Promise.resolve({ id: 'new-id', ...data }),
    );
  });

  it('requires academicYearId', async () => {
    await expect(
      service.importCsv('t1', undefined, 'a,b\n1,2'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects an empty CSV body', async () => {
    await expect(service.importCsv('t1', AY, '   ')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('404s when the academic year does not belong to the tenant', async () => {
    prisma.academicYear.findFirst.mockResolvedValue(null);
    await expect(
      service.importCsv(
        't1',
        AY,
        csv('2026-10-21,2083-07-05,Dashain,दशैं,true'),
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates valid rows and reports invalid ones without aborting', async () => {
    const result = await service.importCsv(
      't1',
      AY,
      csv(
        '2026-10-21,2083-07-05,Vijaya Dashami,विजयादशमी,true', // valid
        '2026-13-40,2083-08-08,Bad Date,मिति,true', // invalid date
        ',2083-08-09,Missing Date,मिति,true', // missing dateAd
        '2026-11-05,2083-07-20,Laxmi Puja,लक्ष्मी पूजा,maybe', // invalid isHoliday
      ),
    );

    expect(result.total).toBe(4);
    expect(result.created).toBe(1);
    expect(result.errors).toHaveLength(3);
    expect(result.errors.map((e) => e.line)).toEqual([3, 4, 5]);
    // exactly one event was inserted, with the parsed data
    expect(prisma.academicCalendarEvent.create).toHaveBeenCalledTimes(1);
    const created = prisma.academicCalendarEvent.create.mock.calls[0][0].data;
    expect(created.titleEn).toBe('Vijaya Dashami');
    expect(created.isHoliday).toBe(true);
    expect(created.dateAd.toISOString().slice(0, 10)).toBe('2026-10-21');
  });

  it('rejects impossible calendar dates like 2026-02-31', async () => {
    const result = await service.importCsv(
      't1',
      AY,
      csv('2026-02-31,2082-11-19,Bad,मिति,true'),
    );
    expect(result.created).toBe(0);
    expect(result.errors).toHaveLength(1);
  });

  it('skips duplicates that already exist in the same academic year', async () => {
    prisma.academicCalendarEvent.findMany.mockResolvedValue([
      {
        dateAd: new Date('2026-10-21T00:00:00.000Z'),
        titleEn: 'Vijaya Dashami',
      },
    ]);

    const result = await service.importCsv(
      't1',
      AY,
      csv(
        '2026-10-21,2083-07-05,Vijaya Dashami,विजयादशमी,true', // duplicate (case-insensitive title match below)
        '2026-11-05,2083-07-20,Laxmi Puja,लक्ष्मी पूजा,true', // new
      ),
    );

    expect(result.created).toBe(1);
    expect(result.duplicates).toBe(1);
  });

  it('is case-insensitive on the header and tolerates quoted commas', async () => {
    const result = await service.importCsv(
      't1',
      AY,
      [
        'DATEAD,TITLEEN,ISHOLIDAY',
        '2026-10-21,"Vijaya Dashami, Main Day",true',
      ].join('\n'),
    );

    expect(result.errors).toEqual([]);
    expect(result.created).toBe(1);
    expect(
      prisma.academicCalendarEvent.create.mock.calls[0][0].data.titleEn,
    ).toBe('Vijaya Dashami, Main Day');
  });

  it('defaults isHoliday to true when the column is absent or empty', async () => {
    const result = await service.importCsv(
      't1',
      AY,
      ['dateAd,titleEn', '2026-10-21,Dashain'].join('\n'),
    );
    expect(result.created).toBe(1);
    expect(
      prisma.academicCalendarEvent.create.mock.calls[0][0].data.isHoliday,
    ).toBe(true);
  });
});
