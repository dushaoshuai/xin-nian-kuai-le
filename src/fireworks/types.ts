export interface Vec2 {
  x: number;
  y: number;
}

export interface FireworkTypeConfig {
  id: string;
  launchSpeed: number;
  trailLength: number;
  particleCount: number;
  lifetimeMs: number;
  palette: string[];
  explosionStrategy: string;
}

export interface ExplosionContext {
  origin: Vec2;
  config: FireworkTypeConfig;
}

export interface FireworkViewport {
  width: number;
  height: number;
}

export interface ParticleSeed {
  velocity: Vec2;
  color: string;
  lifeMs: number;
  size: number;
  gravity: number;
  drag: number;
}
