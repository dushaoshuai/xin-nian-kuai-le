import './styles.css';

import { TimeService } from './core/timeService';
import { StateMachine } from './core/stateMachine';
import { AppState } from './core/types';
import { FireworkEngine } from './fireworks/engine';
import { fireworkRegistry } from './fireworks/registry';
import { FireworkSceneController } from './fireworks/sceneController';
import { ThemeController } from './ui/theme';
import { TimePanel } from './ui/timePanel';

const canvas = document.getElementById('fireworks-canvas') as HTMLCanvasElement;
const engine = new FireworkEngine(canvas);
const scene = new FireworkSceneController();
const timeService = new TimeService();
const machine = new StateMachine();
const panel = new TimePanel();
const theme = new ThemeController();
let autoShowCooldownMs = 0;
const forceParam = (new URLSearchParams(window.location.search).get('forceClickFireworks') ?? '').toLowerCase();
const forceClickFireworks = ['1', 'true', 'on', 'yes'].includes(forceParam);

window.addEventListener('resize', () => {
  engine.resize();
  scene.update(0);
});

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
  scene.requestLaunch(
    {
      config: pickFirework(),
      targetX: x,
      targetY,
      source: 'pointer'
    },
    engine.getViewport()
  );
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

function requestAutoShowLaunch(dtMs: number): void {
  autoShowCooldownMs -= dtMs;
  if (autoShowCooldownMs > 0) {
    return;
  }

  const viewport = engine.getViewport();
  const accepted = scene.requestLaunch(
    {
      config: pickFirework(),
      targetX: viewport.width * (0.18 + Math.random() * 0.64),
      targetY: viewport.height * (0.16 + Math.random() * 0.36),
      source: 'auto-show'
    },
    viewport
  );
  autoShowCooldownMs = accepted ? 180 + Math.random() * 180 : 90;
}

function frame(nowPerfMs: number): void {
  const dtMs = Math.min(33, nowPerfMs - lastFrameMs);
  lastFrameMs = nowPerfMs;

  const ctx = timeService.getContext(Date.now());
  const change = machine.sync(ctx);

  theme.apply(ctx);
  panel.update(ctx);

  if (change && change.to === AppState.NEW_YEAR_SHOW) {
    scene.requestLaunch(
      {
        config: pickFirework(),
        targetX: window.innerWidth * 0.5,
        targetY: window.innerHeight * 0.32,
        source: 'state-transition'
      },
      engine.getViewport()
    );
  }

  const skyFade = ctx.state === AppState.COUNTDOWN ? 0 : ctx.isNight ? 0.18 : 0;
  engine.clearSky(skyFade);
  const dispatches = scene.update(dtMs);

  if (ctx.state === AppState.NEW_YEAR_SHOW) {
    requestAutoShowLaunch(dtMs);
  }

  for (const dispatch of dispatches) {
    engine.launchFromGroundTo(dispatch.config, dispatch.targetX, dispatch.targetY, dispatch.launchX);
  }
  engine.update(dtMs);
  engine.render();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
