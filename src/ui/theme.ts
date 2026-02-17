import { AppState, type TimeContext } from '../core/types';

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export class ThemeController {
  apply(ctx: TimeContext): void {
    const root = document.documentElement;
    const light = ctx.dayLightLevel;
    const darkness = 1 - light;

    const bgTop = `rgb(${Math.round(mix(28, 255, light))}, ${Math.round(mix(22, 241, light))}, ${Math.round(mix(44, 230, light))})`;
    const bgBottom = `rgb(${Math.round(mix(12, 255, light))}, ${Math.round(mix(10, 216, light))}, ${Math.round(mix(26, 194, light))})`;
    const defaultText = ctx.isNight ? 'rgb(242, 236, 226)' : 'rgb(56, 42, 36)';
    const defaultLine = ctx.isNight ? `rgba(255, 255, 255, ${0.07 + darkness * 0.12})` : `rgba(120, 80, 66, ${0.015 + darkness * 0.06})`;
    const panelBg = ctx.isNight ? 'rgba(10, 14, 28, 0.26)' : 'rgba(255, 244, 232, 0.14)';

    root.style.setProperty('--bg-top', bgTop);
    root.style.setProperty('--bg-bottom', bgBottom);
    root.style.setProperty('--text-color', defaultText);
    root.style.setProperty('--line-color', defaultLine);
    root.style.setProperty('--panel-bg', panelBg);

    if (ctx.state === AppState.COUNTDOWN) {
      root.style.setProperty('--festival-overlay', '0.62');
      root.style.setProperty('--festival-hue', '8');
      root.style.setProperty('--text-color', '#f6f2e8');
      root.style.setProperty('--line-color', `rgba(255, 255, 255, ${0.07 + darkness * 0.12})`);
      root.style.setProperty('--panel-bg', 'rgba(85, 10, 18, 0.22)');
    } else if (ctx.isFirstMonthFestival) {
      root.style.setProperty('--festival-overlay', '0.35');
      root.style.setProperty('--festival-hue', '6');
      root.style.setProperty('--text-color', '#f6f2e8');
      root.style.setProperty('--line-color', `rgba(255, 255, 255, ${0.07 + darkness * 0.12})`);
      root.style.setProperty('--panel-bg', 'rgba(98, 12, 26, 0.2)');
    } else {
      root.style.setProperty('--festival-overlay', '0');
      root.style.setProperty('--festival-hue', '0');
    }
  }
}
