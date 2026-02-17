import { strategies } from './strategies';
import type { ExplosionContext, FireworkTypeConfig, ParticleSeed } from './types';

export class FireworkFactory {
  explode(origin: { x: number; y: number }, config: FireworkTypeConfig): ParticleSeed[] {
    const strategy = strategies[config.explosionStrategy];
    if (!strategy) {
      throw new Error(`Unknown explosion strategy: ${config.explosionStrategy}`);
    }
    const ctx: ExplosionContext = { origin, config };
    return strategy(ctx);
  }
}
