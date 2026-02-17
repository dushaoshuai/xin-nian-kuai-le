import './styles.css';

import { TimeService } from './core/timeService';
import { StateMachine } from './core/stateMachine';
import { AppState } from './core/types';
import { FireworkEngine } from './fireworks/engine';
import { fireworkRegistry } from './fireworks/registry';
import { ThemeController } from './ui/theme';
import { TimePanel } from './ui/timePanel';

const canvas = document.getElementById('fireworks-canvas') as HTMLCanvasElement;
const engine = new FireworkEngine(canvas);
const timeService = new TimeService();
const machine = new StateMachine();
const panel = new TimePanel();
const theme = new ThemeController();
const forceParam = (new URLSearchParams(window.location.search).get('forceClickFireworks') ?? '').toLowerCase();
const forceClickFireworks = ['1', 'true', 'on', 'yes'].includes(forceParam);

window.addEventListener('resize', () => engine.resize());

function pickFirework() {
  return fireworkRegistry[Math.floor(Math.random() * fireworkRegistry.length)];
}

function onPointerDown(event: PointerEvent): void {
  const now = timeService.getContext(Date.now());
  if (!now.isNight && !forceClickFireworks) {
    return;
  }
  if (now.state === AppState.COUNTDOWN) {
    return;
  }

  const x = typeof event.clientX === 'number' ? event.clientX : window.innerWidth * 0.5;
  const y = typeof event.clientY === 'number' ? event.clientY : window.innerHeight * 0.45;
  const targetY = Math.min(y, window.innerHeight * 0.76);
  engine.launchFromGroundTo(pickFirework(), x, targetY);
}

window.addEventListener('pointerdown', onPointerDown);
let lastPointerDownTs = 0;

window.addEventListener('pointerdown', () => {
  lastPointerDownTs = performance.now();
});

window.addEventListener('click', (event: MouseEvent) => {
  if (performance.now() - lastPointerDownTs < 260) {
    return;
  }
  onPointerDown(event as unknown as PointerEvent);
});

let lastFrameMs = performance.now();

function frame(nowPerfMs: number): void {
  const dtMs = Math.min(33, nowPerfMs - lastFrameMs);
  lastFrameMs = nowPerfMs;

  const ctx = timeService.getContext(Date.now());
  const change = machine.sync(ctx);

  theme.apply(ctx);
  panel.update(ctx);

  if (change && change.to === AppState.NEW_YEAR_SHOW) {
    engine.launch(pickFirework(), window.innerWidth * 0.5, window.innerHeight * 0.32);
  }

  const skyFade = ctx.state === AppState.COUNTDOWN ? 0 : ctx.isNight ? 0.18 : 0;
  engine.clearSky(skyFade);

  if (ctx.state === AppState.NEW_YEAR_SHOW) {
    engine.scheduleShow(dtMs, pickFirework);
  }

  engine.update(dtMs);
  engine.render();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
