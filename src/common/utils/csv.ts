/**
 * Minimal, dependency-free CSV parsing.
 *
 * Handles the parts of RFC 4180 that matter for hand-maintained school
 * spreadsheets exported from Excel/Google Sheets:
 *   - quoted fields with embedded commas, double quotes ("")
 *   - CRLF / LF line endings and a leading BOM
 *   - blank lines between records
 *
 * `csvToRecords` reports the physical line number of every record so
 * import errors can point the user at the exact spreadsheet row.
 */

export interface CsvParseOptions {
  /** Maximum number of data rows accepted (header excluded). Defaults to 5000. */
  maxRows?: number;
}

interface RawRow {
  cells: string[];
  /** 1-based physical line number in the source text. */
  line: number;
}

function parseRaw(text: string, options: CsvParseOptions = {}): RawRow[] {
  const maxRows = options.maxRows ?? 5000;
  if (typeof text !== 'string') return [];

  // Strip a UTF-8 BOM Excel emits.
  const input = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const rows: RawRow[] = [];
  let field = '';
  let row: string[] = [];
  let rowLine = 1;
  let inQuotes = false;
  let fieldStarted = false;

  const pushField = () => {
    row.push(fieldStarted ? field.trim() : '');
    field = '';
    fieldStarted = false;
  };
  const pushRow = (line: number) => {
    if (!(row.length === 1 && row[0] === '' && rows.length > 0)) {
      // Skip completely blank lines (but they still consume a line number).
      rows.push({ cells: row, line });
    }
    row = [];
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++; // consume the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      fieldStarted = true;
      continue;
    }
    if (ch === ',') {
      pushField();
      if (rows.length + 1 > maxRows + 1) {
        throw new Error(`CSV exceeds the ${maxRows} row limit`);
      }
      continue;
    }
    if (ch === '\r') {
      continue; // handled by the following \n (or dropped)
    }
    if (ch === '\n') {
      pushField();
      pushRow(rowLine);
      rowLine++;
      if (rows.length > maxRows + 1) {
        throw new Error(`CSV exceeds the ${maxRows} row limit`);
      }
      continue;
    }
    field += ch;
    fieldStarted = true;
  }

  // Flush the last field/row if the file does not end with a newline.
  if (field.length > 0 || fieldStarted || row.length > 0) {
    pushField();
    pushRow(rowLine);
  }

  return rows;
}

/**
 * Parses raw CSV text into an array of rows without any header handling.
 */
export function parseCsv(
  text: string,
  options: CsvParseOptions = {},
): string[][] {
  return parseRaw(text, options).map((r) => r.cells);
}

export interface CsvRecord {
  /** 1-based physical line number in the original file (header = line 1). */
  line: number;
  values: Record<string, string>;
}

/**
 * Converts CSV text into typed records keyed by a normalised header
 * (lower-cased, trimmed). Blank lines are skipped; rows shorter than the
 * header are tolerated — missing columns come through as ''.
 */
export function csvToRecords(
  text: string,
  options: CsvParseOptions = {},
): CsvRecord[] {
  const rows = parseRaw(text, options);
  if (rows.length === 0) return [];

  const header = rows[0].cells.map((h) => h.trim().toLowerCase());
  const records: CsvRecord[] = [];

  for (let i = 1; i < rows.length; i++) {
    const { cells } = rows[i];
    if (cells.length === 1 && cells[0] === '') continue; // blank line
    const values: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) {
      values[header[j]] = (cells[j] ?? '').trim();
    }
    records.push({ line: rows[i].line, values });
  }

  return records;
}
