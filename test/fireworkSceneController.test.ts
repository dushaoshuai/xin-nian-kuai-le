import { describe, expect, it } from 'vitest';
import { FireworkSceneController } from '../src/fireworks/sceneController';
import type { SceneLaunchRequest, ViewportSize } from '../src/fireworks/sceneTypes';
import type { FireworkTypeConfig } from '../src/fireworks/types';

const viewport: ViewportSize = { width: 960, height: 720 };
const mobileViewport: ViewportSize = { width: 320, height: 568 };

const config: FireworkTypeConfig = {
  id: 'test-shell',
  launchSpeed: 360,
  trailLength: 14,
  particleCount: 64,
  lifetimeMs: 900,
  palette: ['#ffe9bf'],
  explosionStrategy: 'ring'
};

function createRequest(targetX = 640, targetY = 240): SceneLaunchRequest {
  return {
    config,
    targetX,
    targetY,
    source: 'pointer'
  };
}

function advanceUntil(
  controller: FireworkSceneController,
  expectedPhase: string,
  stepMs = 16,
  maxSteps = 120
): void {
  for (let i = 0; i < maxSteps; i += 1) {
    if (controller.getDebugState().phase === expectedPhase) {
      return;
    }
    controller.update(stepMs);
  }
  throw new Error(`Phase ${expectedPhase} was not reached`);
}

describe('FireworkSceneController', () => {
  it('progresses through the runner sequence and dispatches only after reaching launch-ready', () => {
    const controller = new FireworkSceneController();

    expect(controller.requestLaunch(createRequest(), viewport)).toBe(true);

    const early = controller.update(100);
    expect(early).toHaveLength(0);
    expect(controller.getDebugState().phase).toBe('fading-in');
    expect(controller.getDebugState().opacity).toBeGreaterThan(0);

    advanceUntil(controller, 'running-to-launch');
    expect(controller.getDebugState().phase).toBe('running-to-launch');

    advanceUntil(controller, 'launch-ready');
    expect(controller.getDebugState().phase).toBe('launch-ready');
    expect(controller.getDebugState().currentX).toBe(controller.getDebugState().launchX);

    const dispatches = controller.update(16);
    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].config.id).toBe(config.id);
    expect(dispatches[0].launchX).toBe(controller.getDebugState().launchX);
    expect(dispatches[0].targetY).toBe(240);
    expect(controller.getDebugState().phase).toBe('running-back');
  });

  it('rejects overlapping launches and can interrupt cleanly', () => {
    const controller = new FireworkSceneController();

    expect(controller.requestLaunch(createRequest(700, 220), viewport)).toBe(true);
    expect(controller.requestLaunch(createRequest(400, 180), viewport)).toBe(false);

    controller.update(240);
    controller.interrupt();
    expect(controller.getDebugState().phase).toBe('fading-out');

    for (let i = 0; i < 6; i += 1) {
      controller.update(50);
    }

    expect(controller.getDebugState().phase).toBe('hidden');
    expect(controller.getDebugState().hasActiveSequence).toBe(false);
  });

  it('transitions opacity smoothly on entry and exit', () => {
    const controller = new FireworkSceneController();
    controller.requestLaunch(createRequest(), viewport);

    controller.update(60);
    const enteringOpacity = controller.getDebugState().opacity;
    expect(enteringOpacity).toBeGreaterThan(0);
    expect(enteringOpacity).toBeLessThan(1);

    advanceUntil(controller, 'launch-ready');
    controller.update(16);
    advanceUntil(controller, 'fading-out');
    expect(controller.getDebugState().phase).toBe('fading-out');

    controller.update(60);
    const exitingOpacity = controller.getDebugState().opacity;
    expect(exitingOpacity).toBeGreaterThan(0);
    expect(exitingOpacity).toBeLessThan(1);
  });

  it('keeps launches within safe insets on narrow viewports', () => {
    const controller = new FireworkSceneController();
    controller.requestLaunch(createRequest(10, 180), mobileViewport);
    controller.update(1);

    const debug = controller.getDebugState();

    expect(debug.startX).toBeGreaterThanOrEqual(20);
    expect(debug.launchX).toBeGreaterThanOrEqual(20);
    expect(debug.startX).toBeLessThanOrEqual(mobileViewport.width - 20);
    expect(debug.launchX).toBeLessThanOrEqual(mobileViewport.width - 20);
    expect(debug.currentX).toBeGreaterThanOrEqual(20);
    expect(debug.currentX).toBeLessThanOrEqual(mobileViewport.width - 20);
  });
});
