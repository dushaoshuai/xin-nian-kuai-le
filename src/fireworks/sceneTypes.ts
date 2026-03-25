import type { FireworkTypeConfig } from './types';

export type RunnerPhase =
  | 'hidden'
  | 'fading-in'
  | 'running-to-launch'
  | 'launch-ready'
  | 'running-back'
  | 'fading-out';

export type RunnerFacing = 'left' | 'right';

export type LaunchSource = 'auto-show' | 'pointer' | 'state-transition';

export interface ViewportSize {
  width: number;
  height: number;
}

export interface GroundPoint {
  x: number;
  y: number;
}

export interface SceneLaunchRequest {
  config: FireworkTypeConfig;
  targetX: number;
  targetY: number;
  source: LaunchSource;
}

export interface SceneDispatch {
  config: FireworkTypeConfig;
  source: LaunchSource;
  launchX: number;
  launchY: number;
  targetX: number;
  targetY: number;
}

export interface RunnerSequence {
  phase: RunnerPhase;
  elapsedMs: number;
  opacity: number;
  config: FireworkTypeConfig;
  startPosition: GroundPoint;
  launchPosition: GroundPoint;
  currentPosition: GroundPoint;
  facing: RunnerFacing;
  pendingLaunch: boolean;
  activeConfigId: string;
  source: LaunchSource;
  targetY: number;
}

export interface GroundPath {
  baselineY: number;
  startX: number;
  launchX: number;
  safeInsetX: number;
}

export interface SceneTimings {
  fadeInMs: number;
  runToLaunchMs: number;
  launchHoldMs: number;
  runBackMs: number;
  fadeOutMs: number;
}

export interface SceneDebugState {
  phase: RunnerPhase;
  hasActiveSequence: boolean;
  pendingLaunch: boolean;
  startX: number;
  launchX: number;
  currentX: number;
  opacity: number;
}

export const DEFAULT_SCENE_TIMINGS: SceneTimings = {
  fadeInMs: 240,
  runToLaunchMs: 360,
  launchHoldMs: 36,
  runBackMs: 380,
  fadeOutMs: 220
};
