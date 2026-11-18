import { describe, expect, it } from 'vitest';
import { csvToRecords, parseCsv } from './csv.js';

describe('parseCsv', () => {
  it('parses a simple file', () => {
    expect(parseCsv('a,b\n1,2\n3,4\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
      ['3', '4'],
    ]);
  });

  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('strips a UTF-8 BOM', () => {
    expect(parseCsv('\uFEFFa,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('keeps commas inside quoted fields', () => {
    expect(parseCsv('name,note\n"Sharma, Ram","holiday, exam"\n')).toEqual([
      ['name', 'note'],
      ['Sharma, Ram', 'holiday, exam'],
    ]);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCsv('q\n"say ""hello"""\n')).toEqual([['q'], ['say "hello"']]);
  });

  it('skips blank lines and trims unquoted values', () => {
    expect(parseCsv('a\n\n 1 \n\n2\n')).toEqual([['a'], ['1'], ['2']]);
  });

  it('returns an empty array for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });

  it('enforces the row limit', () => {
    const csv = Array.from({ length: 12 }, (_, i) => `r${i}`).join('\n');
    expect(() => parseCsv(csv, { maxRows: 5 })).toThrow(/row limit/);
  });
});

describe('csvToRecords', () => {
  it('keys rows by the normalised header', () => {
    const records = csvToRecords(
      'DateAD,Title En\n2026-10-21,Vijaya Dashami\n',
    );
    expect(records).toEqual([
      {
        line: 2,
        values: { datead: '2026-10-21', 'title en': 'Vijaya Dashami' },
      },
    ]);
  });

  it('tolerates rows shorter than the header', () => {
    const records = csvToRecords('a,b,c\n1,2\n');
    expect(records[0].values).toEqual({ a: '1', b: '2', c: '' });
  });

  it('skips blank lines and reports line numbers', () => {
    const records = csvToRecords('a\n\n1\n2\n');
    expect(records.map((r) => r.line)).toEqual([3, 4]);
  });
});
