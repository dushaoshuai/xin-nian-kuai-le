import type { ExplosionContext, ParticleSeed } from '../types';

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function emitRadial(count: number, speedMin: number, speedMax: number, ctx: ExplosionContext): ParticleSeed[] {
  const particles: ParticleSeed[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + random(-0.06, 0.06);
    const speed = random(speedMin, speedMax);
    particles.push({
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      color: ctx.config.palette[i % ctx.config.palette.length],
      lifeMs: random(ctx.config.lifetimeMs * 0.7, ctx.config.lifetimeMs * 1.15),
      size: random(1.2, 2.8),
      gravity: random(18, 35),
      drag: random(0.976, 0.988)
    });
  }
  return particles;
}

function ring(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 65, 95, ctx);
}

function chrysanthemum(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 45, 120, ctx);
}

function peony(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 35, 80, ctx).map((seed) => ({
    ...seed,
    gravity: 24,
    drag: 0.984
  }));
}

function willow(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 30, 65, ctx).map((seed) => ({
    ...seed,
    gravity: random(28, 38),
    drag: 0.992,
    lifeMs: seed.lifeMs * 1.5,
    size: seed.size * 1.15
  }));
}

function palm(ctx: ExplosionContext): ParticleSeed[] {
  const out: ParticleSeed[] = [];
  const branches = 10;
  const per = Math.floor(ctx.config.particleCount / branches);
  for (let i = 0; i < branches; i += 1) {
    const branchAngle = random(-Math.PI * 0.9, -Math.PI * 0.1);
    for (let j = 0; j < per; j += 1) {
      const angle = branchAngle + random(-0.08, 0.08);
      const speed = random(50, 95);
      out.push({
        velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        color: ctx.config.palette[(i + j) % ctx.config.palette.length],
        lifeMs: random(ctx.config.lifetimeMs * 0.7, ctx.config.lifetimeMs * 1.2),
        size: random(1.3, 2.9),
        gravity: 26,
        drag: 0.986
      });
    }
  }
  return out;
}

function comet(ctx: ExplosionContext): ParticleSeed[] {
  const out: ParticleSeed[] = [];
  for (let i = 0; i < ctx.config.particleCount; i += 1) {
    const angle = random(-Math.PI * 0.2, Math.PI * 0.2);
    const speed = random(45, 130);
    out.push({
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed - random(12, 32) },
      color: ctx.config.palette[i % ctx.config.palette.length],
      lifeMs: random(ctx.config.lifetimeMs * 0.4, ctx.config.lifetimeMs * 1.3),
      size: random(1.1, 2.4),
      gravity: random(15, 26),
      drag: 0.982
    });
  }
  return out;
}

function crackle(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 55, 110, ctx).map((seed, idx) => ({
    ...seed,
    color: idx % 3 === 0 ? '#ffffff' : seed.color,
    lifeMs: seed.lifeMs * random(0.4, 0.9),
    size: random(0.8, 2)
  }));
}

function fan(ctx: ExplosionContext): ParticleSeed[] {
  const out: ParticleSeed[] = [];
  for (let i = 0; i < ctx.config.particleCount; i += 1) {
    const angle = random(-Math.PI * 0.95, -Math.PI * 0.05);
    const speed = random(40, 100);
    out.push({
      velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      color: ctx.config.palette[i % ctx.config.palette.length],
      lifeMs: random(ctx.config.lifetimeMs * 0.6, ctx.config.lifetimeMs * 1.1),
      size: random(1.1, 2.4),
      gravity: 22,
      drag: 0.984
    });
  }
  return out;
}

function strobe(ctx: ExplosionContext): ParticleSeed[] {
  return emitRadial(ctx.config.particleCount, 50, 100, ctx).map((seed) => ({
    ...seed,
    lifeMs: seed.lifeMs * 0.8,
    size: 1.8,
    gravity: 18,
    drag: 0.98
  }));
}

function doubleBurst(ctx: ExplosionContext): ParticleSeed[] {
  const first = emitRadial(Math.floor(ctx.config.particleCount * 0.6), 35, 75, ctx);
  const second = emitRadial(Math.floor(ctx.config.particleCount * 0.4), 80, 130, ctx);
  return first.concat(second);
}

export const strategies: Record<string, (ctx: ExplosionContext) => ParticleSeed[]> = {
  ring,
  chrysanthemum,
  peony,
  willow,
  palm,
  comet,
  crackle,
  fan,
  strobe,
  'double-burst': doubleBurst
};
