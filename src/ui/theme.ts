import { AppState, type TimeContext } from '../core/types';

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export class ThemeController {
  apply(ctx: TimeContext): void {
    const root = document.documentElement;
    const light = ctx.dayLightLevel;
    const darkness = 1 - light;

    const bgTop = `rgb(${Math.round(mix(14, 94, light))}, ${Math.round(mix(8, 162, light))}, ${Math.round(mix(30, 246, light))})`;
    const bgBottom = `rgb(${Math.round(mix(3, 22, light))}, ${Math.round(mix(4, 72, light))}, ${Math.round(mix(16, 134, light))})`;
    const bgGlow = `rgba(${Math.round(mix(34, 35, light))}, ${Math.round(mix(235, 197, light))}, ${Math.round(mix(255, 255, light))}, ${0.18 + light * 0.16})`;
    const panelBg = ctx.isNight ? 'rgba(5, 16, 36, 0.42)' : 'rgba(198, 244, 255, 0.2)';
    const panelBorder = ctx.isNight ? 'rgba(128, 247, 255, 0.34)' : 'rgba(30, 184, 255, 0.3)';
    const panelShadow = ctx.isNight
      ? '0 22px 80px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : '0 18px 60px rgba(13, 63, 104, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.48)';
    const defaultText = ctx.isNight ? 'rgb(233, 247, 255)' : 'rgb(8, 42, 66)';
    const defaultLine = ctx.isNight
      ? `rgba(87, 233, 255, ${0.12 + darkness * 0.18})`
      : `rgba(0, 129, 201, ${0.06 + darkness * 0.1})`;
    const accent = ctx.isNight ? 'rgb(92, 245, 255)' : 'rgb(0, 170, 255)';
    const accentStrong = ctx.isNight ? 'rgb(255, 74, 186)' : 'rgb(255, 73, 142)';
    const accentWarm = ctx.isNight ? 'rgb(255, 170, 55)' : 'rgb(255, 112, 42)';
    const gridTint = ctx.isNight ? `rgba(72, 202, 255, ${0.08 + darkness * 0.08})` : `rgba(0, 122, 204, ${0.05 + darkness * 0.05})`;

    root.style.setProperty('--bg-top', bgTop);
    root.style.setProperty('--bg-bottom', bgBottom);
    root.style.setProperty('--bg-glow', bgGlow);
    root.style.setProperty('--text-color', defaultText);
    root.style.setProperty('--line-color', defaultLine);
    root.style.setProperty('--panel-bg', panelBg);
    root.style.setProperty('--panel-border', panelBorder);
    root.style.setProperty('--panel-shadow', panelShadow);
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--accent-strong', accentStrong);
    root.style.setProperty('--accent-warm', accentWarm);
    root.style.setProperty('--grid-tint', gridTint);

    if (ctx.state === AppState.COUNTDOWN) {
      root.style.setProperty('--festival-overlay', '0.78');
      root.style.setProperty('--festival-hue', '338');
      root.style.setProperty('--text-color', '#f7f5ff');
      root.style.setProperty('--line-color', `rgba(255, 108, 201, ${0.16 + darkness * 0.18})`);
      root.style.setProperty('--panel-bg', 'rgba(46, 4, 30, 0.46)');
      root.style.setProperty('--panel-border', 'rgba(255, 107, 206, 0.42)');
      root.style.setProperty('--panel-shadow', '0 28px 90px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--accent-color', '#7cf9ff');
      root.style.setProperty('--accent-strong', '#ff5fb6');
      root.style.setProperty('--accent-warm', '#ffb347');
      root.style.setProperty('--grid-tint', `rgba(255, 92, 191, ${0.12 + darkness * 0.1})`);
      root.style.setProperty('--bg-glow', 'rgba(255, 71, 167, 0.28)');
    } else if (ctx.isFirstMonthFestival) {
      root.style.setProperty('--festival-overlay', '0.48');
      root.style.setProperty('--festival-hue', '18');
      root.style.setProperty('--text-color', '#fff3eb');
      root.style.setProperty('--line-color', `rgba(255, 147, 94, ${0.14 + darkness * 0.14})`);
      root.style.setProperty('--panel-bg', 'rgba(54, 10, 24, 0.4)');
      root.style.setProperty('--panel-border', 'rgba(255, 138, 92, 0.36)');
      root.style.setProperty('--panel-shadow', '0 24px 84px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--accent-color', '#78f0ff');
      root.style.setProperty('--accent-strong', '#ff7c5c');
      root.style.setProperty('--accent-warm', '#ffd166');
      root.style.setProperty('--grid-tint', `rgba(255, 136, 82, ${0.1 + darkness * 0.08})`);
      root.style.setProperty('--bg-glow', 'rgba(255, 132, 93, 0.22)');
    } else {
      root.style.setProperty('--festival-overlay', '0');
      root.style.setProperty('--festival-hue', '0');
    }
  }
}
