import type { FireworkTypeConfig } from './types';
import { FireworkFactory } from './factory';

interface Rocket {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  color: string;
  trail: Array<{ x: number; y: number }>;
  trailLength: number;
  config: FireworkTypeConfig;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  gravity: number;
  drag: number;
}

interface FireworkEngineHooks {
  onLaunch?: () => void;
  onExplode?: (particleCount: number) => void;
}

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class FireworkEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly factory = new FireworkFactory();
  private rockets: Rocket[] = [];
  private particles: Particle[] = [];
  private width = 1;
  private height = 1;
  private autoCooldownMs = 0;
  private readonly hooks: FireworkEngineHooks;

  constructor(canvas: HTMLCanvasElement, hooks: FireworkEngineHooks = {}) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }
    this.canvas = canvas;
    this.ctx = ctx;
    this.hooks = hooks;
    this.resize();
  }

  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  launch(config: FireworkTypeConfig, targetX: number, targetY: number): void {
    const startX = random(this.width * 0.15, this.width * 0.85);
    const startY = this.height + 8;
    this.rockets.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      speed: config.launchSpeed,
      color: config.palette[0],
      trail: [],
      trailLength: config.trailLength,
      config
    });
    this.hooks.onLaunch?.();
  }

  launchFromGroundTo(config: FireworkTypeConfig, targetX: number, targetY: number): void {
    const startY = this.height + 8;
    const startX = targetX + random(-50, 50);
    this.rockets.push({
      x: startX,
      y: startY,
      targetX,
      targetY,
      speed: config.launchSpeed,
      color: config.palette[0],
      trail: [],
      trailLength: config.trailLength,
      config
    });
    this.hooks.onLaunch?.();
  }

  scheduleShow(dtMs: number, pickConfig: () => FireworkTypeConfig): void {
    this.autoCooldownMs -= dtMs;
    if (this.autoCooldownMs > 0) {
      return;
    }
    const config = pickConfig();
    const x = random(this.width * 0.08, this.width * 0.92);
    const y = random(this.height * 0.14, this.height * 0.54);
    this.launch(config, x, y);
    this.autoCooldownMs = random(80, 220);
  }

  clearSky(alpha = 0.22): void {
    this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  update(dtMs: number): void {
    const dt = dtMs / 1000;

    this.rockets = this.rockets.filter((rocket) => {
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > rocket.trailLength) {
        rocket.trail.shift();
      }

      const dx = rocket.targetX - rocket.x;
      const dy = rocket.targetY - rocket.y;
      const distance = Math.hypot(dx, dy);
      const step = rocket.speed * dt;

      if (distance <= step || distance < 6) {
        const seeds = this.factory.explode({ x: rocket.targetX, y: rocket.targetY }, rocket.config);
        this.hooks.onExplode?.(seeds.length);
        for (const seed of seeds) {
          this.particles.push({
            x: rocket.targetX,
            y: rocket.targetY,
            vx: seed.velocity.x,
            vy: seed.velocity.y,
            color: seed.color,
            life: seed.lifeMs,
            maxLife: seed.lifeMs,
            size: seed.size,
            gravity: seed.gravity,
            drag: seed.drag
          });
        }
        return false;
      }

      rocket.x += (dx / distance) * step;
      rocket.y += (dy / distance) * step;
      return true;
    });

    this.particles = this.particles.filter((particle) => {
      particle.life -= dtMs;
      if (particle.life <= 0) {
        return false;
      }
      particle.vx *= particle.drag;
      particle.vy = particle.vy * particle.drag + particle.gravity * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      return particle.y < this.height + 60;
    });
  }

  render(): void {
    for (const rocket of this.rockets) {
      this.ctx.beginPath();
      for (let i = 0; i < rocket.trail.length; i += 1) {
        const p = rocket.trail[i];
        if (i === 0) {
          this.ctx.moveTo(p.x, p.y);
        } else {
          this.ctx.lineTo(p.x, p.y);
        }
      }
      this.ctx.strokeStyle = rocket.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = '#fff7dd';
      this.ctx.fill();
    }

    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  getDebugState(): { rockets: number; particles: number } {
    return {
      rockets: this.rockets.length,
      particles: this.particles.length
    };
  }
}
