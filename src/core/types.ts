export enum AppState {
  NORMAL = 'normal',
  COUNTDOWN = 'countdown',
  NEW_YEAR_SHOW = 'new_year_show'
}

export interface TimeContext {
  nowMs: number;
  beijingDate: Date;
  solarText: string;
  lunarDayText: string;
  ganzhiText: string;
  nextNewYearText: string;
  isFirstMonthFestival: boolean;
  isNight: boolean;
  dayLightLevel: number;
  state: AppState;
  countdownSeconds: number | null;
  currentNewYearStartMs: number;
  nextNewYearStartMs: number;
}
