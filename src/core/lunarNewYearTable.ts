const DAY_MS = 24 * 60 * 60 * 1000;
const BJ_OFFSET_MS = 8 * 60 * 60 * 1000;

const lunarFormatter = new Intl.DateTimeFormat('en-u-ca-chinese', {
  timeZone: 'Asia/Shanghai',
  month: 'numeric',
  day: 'numeric'
});

function getLunarMonthDay(utcMs: number): { month: number; day: number } {
  const parts = lunarFormatter.formatToParts(new Date(utcMs));
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? '0');
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? '0');
  return { month, day };
}

function beijingMidnightUtcMs(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 0, 0, 0, 0) - BJ_OFFSET_MS;
}

function findLunarNewYearInGregorianYear(year: number): number {
  const start = beijingMidnightUtcMs(year, 1, 20);
  const end = beijingMidnightUtcMs(year, 2, 25);
  for (let ms = start; ms <= end; ms += DAY_MS) {
    const noon = ms + 12 * 60 * 60 * 1000;
    const lunar = getLunarMonthDay(noon);
    if (lunar.month === 1 && lunar.day === 1) {
      return ms;
    }
  }
  throw new Error(`Unable to find lunar new year date for Gregorian year ${year}`);
}

export function buildLunarNewYearTable(startYear = 2000, endYear = 2100): Map<number, number> {
  const table = new Map<number, number>();
  for (let year = startYear; year <= endYear; year += 1) {
    table.set(year, findLunarNewYearInGregorianYear(year));
  }
  return table;
}

export const lunarNewYearTable = buildLunarNewYearTable(2000, 2100);
