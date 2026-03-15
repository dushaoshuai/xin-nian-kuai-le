import {
  DEFAULT_SCENE_TIMINGS,
  type GroundPath,
  type RunnerFacing,
  type RunnerSequence,
  type SceneDebugState,
  type SceneDispatch,
  type SceneLaunchRequest,
  type SceneRenderState,
  type SceneTimings,
  type ViewportSize
} from './sceneTypes';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function getGroundPath(viewport: ViewportSize, requestedX: number): GroundPath {
  const safeInsetX = Math.max(20, Math.min(64, viewport.width * 0.08));
  const baselineY = clamp(
    viewport.height * (viewport.width <= 768 ? 0.79 : 0.83),
    viewport.height * 0.68,
    viewport.height - Math.max(82, viewport.height * 0.14)
  );
  const minRunDistance = Math.max(40, Math.min(120, viewport.width * 0.18));
  const maxLaunchX = viewport.width - safeInsetX;
  const desiredLaunchX = clamp(requestedX, safeInsetX, maxLaunchX);
  const prefersLeftStart = desiredLaunchX >= viewport.width * 0.5;
  const direction = prefersLeftStart ? 1 : -1;
  let startX = desiredLaunchX - direction * minRunDistance;
  startX = clamp(startX, safeInsetX, maxLaunchX);

  if (Math.abs(desiredLaunchX - startX) < minRunDistance * 0.55) {
    startX = clamp(
      desiredLaunchX - direction * minRunDistance,
      safeInsetX,
      maxLaunchX
    );
  }

  const launchX = clamp(
    prefersLeftStart ? Math.max(desiredLaunchX, startX + minRunDistance * 0.55) : Math.min(desiredLaunchX, startX - minRunDistance * 0.55),
    safeInsetX,
    maxLaunchX
  );

  return {
    baselineY,
    startX,
    launchX,
    safeInsetX
  };
}

function getFacing(startX: number, launchX: number): RunnerFacing {
  return launchX >= startX ? 'right' : 'left';
}

export class FireworkSceneController {
  private sequence: RunnerSequence | null = null;
  private renderState: SceneRenderState = {
    phase: 'hidden',
    runnerVisible: false,
    runnerX: 0,
    runnerY: 0,
    runnerOpacity: 0,
    facing: 'right',
    horizonVisible: true,
    horizonY: 0
  };
  private viewport: ViewportSize = { width: 1, height: 1 };
  private readonly timings: SceneTimings;

  constructor(timings: Partial<SceneTimings> = {}) {
    this.timings = { ...DEFAULT_SCENE_TIMINGS, ...timings };
    this.syncRenderState();
  }

  requestLaunch(request: SceneLaunchRequest, viewport: ViewportSize): boolean {
    this.viewport = viewport;
    if (this.sequence && this.sequence.phase !== 'hidden') {
      return false;
    }

    const groundPath = getGroundPath(viewport, request.targetX);
    const facing = getFacing(groundPath.startX, groundPath.launchX);
    this.sequence = {
      phase: 'fading-in',
      elapsedMs: 0,
      opacity: 0,
      config: request.config,
      startPosition: { x: groundPath.startX, y: groundPath.baselineY },
      launchPosition: { x: groundPath.launchX, y: groundPath.baselineY },
      currentPosition: { x: groundPath.startX, y: groundPath.baselineY },
      facing,
      pendingLaunch: true,
      activeConfigId: request.config.id,
      source: request.source,
      targetY: request.targetY
    };
    this.syncRenderState();
    return true;
  }

  interrupt(): void {
    if (!this.sequence || this.sequence.phase === 'hidden') {
      return;
    }
    this.sequence.phase = 'fading-out';
    this.sequence.elapsedMs = 0;
    this.sequence.pendingLaunch = false;
    this.syncRenderState();
  }

  update(dtMs: number, viewport: ViewportSize): SceneDispatch[] {
    this.viewport = viewport;
    const dispatches: SceneDispatch[] = [];
    if (!this.sequence || this.sequence.phase === 'hidden') {
      this.syncRenderState();
      return dispatches;
    }

    const dt = Math.max(0, Math.min(dtMs, 64));
    this.sequence.startPosition.y = this.getHorizonY();
    this.sequence.launchPosition.y = this.getHorizonY();
    this.sequence.currentPosition.y = this.getHorizonY();

    switch (this.sequence.phase) {
      case 'fading-in':
        this.sequence.elapsedMs += dt;
        this.sequence.opacity = clamp(this.sequence.elapsedMs / this.timings.fadeInMs, 0, 1);
        if (this.sequence.elapsedMs >= this.timings.fadeInMs) {
          this.sequence.phase = 'running-to-launch';
          this.sequence.elapsedMs = 0;
          this.sequence.opacity = 1;
        }
        break;
      case 'running-to-launch': {
        this.sequence.elapsedMs += dt;
        const progress = clamp(this.sequence.elapsedMs / this.timings.runToLaunchMs, 0, 1);
        this.sequence.currentPosition.x = lerp(
          this.sequence.startPosition.x,
          this.sequence.launchPosition.x,
          progress
        );
        this.sequence.opacity = 1;
        if (progress >= 1) {
          this.sequence.currentPosition.x = this.sequence.launchPosition.x;
          this.sequence.phase = 'launch-ready';
          this.sequence.elapsedMs = 0;
        }
        break;
      }
      case 'launch-ready':
        if (this.sequence.pendingLaunch) {
          dispatches.push({
            config: this.sequence.config,
            source: this.sequence.source,
            launchX: this.sequence.launchPosition.x,
            launchY: this.sequence.launchPosition.y,
            targetX: this.sequence.launchPosition.x,
            targetY: this.sequence.targetY
          });
          this.sequence.pendingLaunch = false;
          this.sequence.phase = 'running-back';
          this.sequence.elapsedMs = 0;
        } else {
          this.sequence.elapsedMs += dt;
          if (this.sequence.elapsedMs >= this.timings.launchHoldMs) {
            this.sequence.phase = 'running-back';
            this.sequence.elapsedMs = 0;
          }
        }
        break;
      case 'running-back': {
        this.sequence.elapsedMs += dt;
        const progress = clamp(this.sequence.elapsedMs / this.timings.runBackMs, 0, 1);
        this.sequence.currentPosition.x = lerp(
          this.sequence.launchPosition.x,
          this.sequence.startPosition.x,
          progress
        );
        if (progress >= 1) {
          this.sequence.currentPosition.x = this.sequence.startPosition.x;
          this.sequence.phase = 'fading-out';
          this.sequence.elapsedMs = 0;
        }
        break;
      }
      case 'fading-out':
        this.sequence.elapsedMs += dt;
        this.sequence.opacity = clamp(1 - this.sequence.elapsedMs / this.timings.fadeOutMs, 0, 1);
        if (this.sequence.elapsedMs >= this.timings.fadeOutMs) {
          this.sequence = null;
        }
        break;
      default:
        this.sequence = null;
        break;
    }
    this.syncRenderState();
    return dispatches;
  }

  getRenderState(): SceneRenderState {
    return this.renderState;
  }

  getDebugState(): SceneDebugState {
    if (!this.sequence) {
      return {
        phase: 'hidden',
        hasActiveSequence: false,
        pendingLaunch: false,
        startX: 0,
        launchX: 0,
        currentX: 0,
        horizonY: this.getHorizonY(),
        opacity: 0
      };
    }

    return {
      phase: this.sequence.phase,
      hasActiveSequence: true,
      pendingLaunch: this.sequence.pendingLaunch,
      startX: this.sequence.startPosition.x,
      launchX: this.sequence.launchPosition.x,
      currentX: this.sequence.currentPosition.x,
      horizonY: this.sequence.currentPosition.y,
      opacity: this.sequence.opacity
    };
  }

  private syncRenderState(): void {
    const horizonY = this.getHorizonY();
    if (!this.sequence) {
      this.renderState = {
        phase: 'hidden',
        runnerVisible: false,
        runnerX: 0,
        runnerY: horizonY,
        runnerOpacity: 0,
        facing: 'right',
        horizonVisible: true,
        horizonY
      };
      return;
    }

    this.renderState = {
      phase: this.sequence.phase,
      runnerVisible: this.sequence.opacity > 0.01 || this.sequence.phase === 'running-to-launch' || this.sequence.phase === 'running-back' || this.sequence.phase === 'launch-ready',
      runnerX: this.sequence.currentPosition.x,
      runnerY: this.sequence.currentPosition.y,
      runnerOpacity: this.sequence.opacity,
      facing: this.sequence.facing,
      horizonVisible: true,
      horizonY
    };
  }

  private getHorizonY(): number {
    return clamp(
      this.viewport.height * (this.viewport.width <= 768 ? 0.79 : 0.83),
      this.viewport.height * 0.68,
      this.viewport.height - Math.max(82, this.viewport.height * 0.14)
    );
  }
}
