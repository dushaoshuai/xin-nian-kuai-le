import { Lunar, Solar } from 'lunar-typescript';

import { parseDebugTime } from '../debug/debugTime';
import { AppState, type TimeContext } from './types';

const BJ_OFFSET_MS = 8 * 60 * 60 * 1000;
const COUNTDOWN_MS = 10 * 1000;
const SHOW_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toBeijingParts(utcMs: number): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const bj = new Date(utcMs + BJ_OFFSET_MS);
  return {
    year: bj.getUTCFullYear(),
    month: bj.getUTCMonth() + 1,
    day: bj.getUTCDate(),
    hour: bj.getUTCHours(),
    minute: bj.getUTCMinutes(),
    second: bj.getUTCSeconds()
  };
}

function beijingMidnightToUtcMs(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day, 0, 0, 0, 0) - BJ_OFFSET_MS;
}

export function formatSolarDate(utcMs: number): string {
  const parts = toBeijingParts(utcMs);
  return `${parts.year} 年 ${pad(parts.month)} 月 ${pad(parts.day)} 日 ${pad(parts.hour)} 时 ${pad(parts.minute)} 分 ${pad(parts.second)} 秒`;
}

function getLunarByUtcMs(utcMs: number): Lunar {
  const parts = toBeijingParts(utcMs);
  const solar = Solar.fromYmdHms(parts.year, parts.month, parts.day, parts.hour, parts.minute, parts.second);
  return solar.getLunar();
}

export function formatLunarDayText(utcMs: number): string {
  const lunar = getLunarByUtcMs(utcMs);
  return `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
}

export function formatGanzhiText(utcMs: number): string {
  const lunar = getLunarByUtcMs(utcMs);
  return `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`;
}

export function isFirstMonthFestival(utcMs: number): boolean {
  const lunar = getLunarByUtcMs(utcMs);
  const month = lunar.getMonth();
  const day = lunar.getDay();
  return month === 1 && day >= 1 && day <= 15;
}

function computeLunarNewYearStartMs(year: number): number {
  for (let month = 1; month <= 2; month += 1) {
    const startDay = month === 1 ? 20 : 1;
    const endDay = month === 1 ? 31 : 25;
    for (let day = startDay; day <= endDay; day += 1) {
      const lunar = Solar.fromYmd(year, month, day).getLunar();
      if (lunar.getMonth() === 1 && lunar.getDay() === 1) {
        return beijingMidnightToUtcMs(year, month, day);
      }
    }
  }
  throw new Error(`Unable to find lunar new year in ${year}`);
}

const newYearCache = new Map<number, number>();

function getLunarNewYearStartMs(year: number): number {
  const cached = newYearCache.get(year);
  if (typeof cached === 'number') {
    return cached;
  }
  const computed = computeLunarNewYearStartMs(year);
  newYearCache.set(year, computed);
  return computed;
}

function getBeijingYear(nowMs: number): number {
  return toBeijingParts(nowMs).year;
}

function getNewYearStarts(nowMs: number): { current: number; next: number } {
  const year = getBeijingYear(nowMs);
  const candidates = [year - 1, year, year + 1, year + 2]
    .map((y) => getLunarNewYearStartMs(y))
    .sort((a, b) => a - b);

  let current = candidates[0];
  let next = candidates[candidates.length - 1];

  for (let i = 0; i < candidates.length; i += 1) {
    if (candidates[i] <= nowMs) {
      current = candidates[i];
    }
    if (candidates[i] > nowMs) {
      next = candidates[i];
      break;
    }
  }

  return { current, next };
}

function getDayLightLevel(nowMs: number): number {
  const parts = toBeijingParts(nowMs);
  const hour = parts.hour + parts.minute / 60 + parts.second / 3600;
  const normalized = 0.5 + 0.5 * Math.sin(((hour - 6) / 24) * Math.PI * 2);
  return Math.min(1, Math.max(0, normalized));
}

export function deriveAppState(nowMs: number, lastNewYearStartMs: number, nextNewYearStartMs: number): {
  state: AppState;
  countdownSeconds: number | null;
} {
  const showEnd = lastNewYearStartMs + SHOW_MS;
  if (nowMs >= lastNewYearStartMs && nowMs < showEnd) {
    return { state: AppState.NEW_YEAR_SHOW, countdownSeconds: null };
  }

  const countdownStart = nextNewYearStartMs - COUNTDOWN_MS;
  if (nowMs >= countdownStart && nowMs < nextNewYearStartMs) {
    const left = nextNewYearStartMs - nowMs;
    return { state: AppState.COUNTDOWN, countdownSeconds: Math.max(0, Math.ceil(left / 1000)) };
  }

  return { state: AppState.NORMAL, countdownSeconds: null };
}

export class TimeService {
  private debugBase: number | null;
  private readonly startedAt = Date.now();

  constructor() {
    this.debugBase = parseDebugTime(window.location.search);
  }

  getNowMs(realNowMs: number): number {
    if (this.debugBase === null) {
      return realNowMs;
    }
    return this.debugBase + (realNowMs - this.startedAt);
  }

  getContext(realNowMs: number): TimeContext {
    const nowMs = this.getNowMs(realNowMs);
    const { current, next } = getNewYearStarts(nowMs);
    const { state, countdownSeconds } = deriveAppState(nowMs, current, next);
    const dayLightLevel = getDayLightLevel(nowMs);
    const lunar = getLunarByUtcMs(nowMs);
    const lunarDayText = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
    const ganzhiText = `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`;
    const festival = lunar.getMonth() === 1 && lunar.getDay() >= 1 && lunar.getDay() <= 15;

    return {
      nowMs,
      beijingDate: new Date(nowMs),
      solarText: formatSolarDate(nowMs),
      lunarDayText,
      ganzhiText,
      nextNewYearText: `下一次新年：${formatSolarDate(next)}`,
      isFirstMonthFestival: festival,
      isNight: dayLightLevel < 0.35,
      dayLightLevel,
      state,
      countdownSeconds,
      currentNewYearStartMs: current,
      nextNewYearStartMs: next
    };
  }
}

export function getLunarNewYearForYear(year: number): number {
  return getLunarNewYearStartMs(year);
}

export function addDays(utcMs: number, days: number): number {
  return utcMs + days * DAY_MS;
}
