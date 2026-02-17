import { describe, expect, it } from 'vitest';
import { AppState } from '../src/core/types';
import { deriveAppState, formatGanzhiText, formatLunarDayText, formatSolarDate, getLunarNewYearForYear } from '../src/core/timeService';

describe('solar formatter', () => {
  it('formats Beijing time consistently', () => {
    const ms = Date.parse('2026-02-17T00:00:00+08:00');
    expect(formatSolarDate(ms)).toBe('2026 年 02 月 17 日 00 时 00 分 00 秒');
  });
});

describe('lunar formatting', () => {
  it('formats lunar day and ganzhi in expected chinese style', () => {
    const ms = Date.parse('2026-02-17T18:04:35+08:00');
    expect(formatLunarDayText(ms)).toBe('正月初一');
    expect(formatGanzhiText(ms)).toMatch(/丙午马年/);
  });
});

describe('lunar new year date', () => {
  it('returns known date for 2027', () => {
    expect(getLunarNewYearForYear(2027)).toBe(Date.parse('2027-02-06T00:00:00+08:00'));
  });
});

describe('state windows', () => {
  it('enters show window for first 10 minutes after new year start', () => {
    const start = Date.parse('2026-02-17T00:00:00+08:00');
    const next = Date.parse('2027-02-06T00:00:00+08:00');
    const result = deriveAppState(start + 5_000, start, next);
    expect(result.state).toBe(AppState.NEW_YEAR_SHOW);
  });
});
