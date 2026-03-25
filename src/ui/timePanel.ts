import { AppState, type TimeContext } from '../core/types';

export class TimePanel {
  private readonly panel = document.getElementById('time-panel');
  private readonly status = document.getElementById('panel-status');
  private readonly panelMode = document.getElementById('panel-mode');
  private readonly solar = document.getElementById('solar-time');
  private readonly lunarDay = document.getElementById('lunar-day');
  private readonly ganzhi = document.getElementById('ganzhi-time');
  private readonly next = document.getElementById('next-new-year');
  private readonly countdown = document.getElementById('countdown');

  update(ctx: TimeContext): void {
    if (
      !this.panel ||
      !this.status ||
      !this.panelMode ||
      !this.solar ||
      !this.lunarDay ||
      !this.ganzhi ||
      !this.next ||
      !this.countdown
    ) {
      return;
    }
    this.solar.textContent = ctx.solarText;
    this.lunarDay.textContent = ctx.lunarDayText;
    this.ganzhi.textContent = ctx.ganzhiText;
    this.next.textContent = ctx.nextNewYearText;
    this.next.classList.toggle('hidden-row', ctx.isFirstMonthFestival);
    document.body.classList.toggle('first-month-mode', ctx.isFirstMonthFestival);
    this.panel.dataset.phase = ctx.state;

    if (ctx.state === AppState.NEW_YEAR_SHOW) {
      this.panel.classList.remove('position-center');
      this.panel.classList.add('position-bottom');
      this.status.textContent = 'FIREWORK MATRIX ACTIVE';
      this.panelMode.textContent = ctx.isNight ? 'NIGHT SHOW' : 'DAY SHOW';
    } else {
      this.panel.classList.remove('position-bottom');
      this.panel.classList.add('position-center');

      if (ctx.state === AppState.COUNTDOWN) {
        this.status.textContent = 'SYNCHRONIZING MIDNIGHT SEQUENCE';
        this.panelMode.textContent = 'COUNTDOWN';
      } else if (ctx.isFirstMonthFestival) {
        this.status.textContent = 'FIRST MONTH FESTIVAL ONLINE';
        this.panelMode.textContent = ctx.isNight ? 'FESTIVAL NIGHT' : 'FESTIVAL DAY';
      } else {
        this.status.textContent = ctx.isNight ? 'NIGHT WATCH FOR SPRING FESTIVAL' : 'DAYLIGHT LUNAR MONITOR';
        this.panelMode.textContent = ctx.isNight ? 'NIGHT WATCH' : 'DAY WATCH';
      }
    }

    if (ctx.state === AppState.COUNTDOWN) {
      this.countdown.classList.remove('hidden');
      this.countdown.textContent = String(ctx.countdownSeconds ?? 0);
      document.body.classList.add('countdown-mode');
    } else {
      this.countdown.classList.add('hidden');
      this.countdown.textContent = '';
      document.body.classList.remove('countdown-mode');
    }
  }
}
