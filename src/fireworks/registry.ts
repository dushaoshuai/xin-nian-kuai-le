import type { FireworkTypeConfig } from './types';

export const fireworkRegistry: FireworkTypeConfig[] = [
  {
    id: 'ring-gold',
    launchSpeed: 360,
    trailLength: 14,
    particleCount: 72,
    lifetimeMs: 950,
    palette: ['#f8d36f', '#f6e18b', '#ffe9bf'],
    explosionStrategy: 'ring'
  },
  {
    id: 'chrysanthemum-red',
    launchSpeed: 390,
    trailLength: 16,
    particleCount: 96,
    lifetimeMs: 1080,
    palette: ['#ff816e', '#ffbf95', '#ffd3bc'],
    explosionStrategy: 'chrysanthemum'
  },
  {
    id: 'peony-violet',
    launchSpeed: 350,
    trailLength: 12,
    particleCount: 88,
    lifetimeMs: 1000,
    palette: ['#c5a8ff', '#e2d1ff', '#f6f0ff'],
    explosionStrategy: 'peony'
  },
  {
    id: 'willow-amber',
    launchSpeed: 340,
    trailLength: 18,
    particleCount: 82,
    lifetimeMs: 1500,
    palette: ['#ffcf8f', '#ffe2b4', '#fff1d2'],
    explosionStrategy: 'willow'
  },
  {
    id: 'palm-jade',
    launchSpeed: 375,
    trailLength: 15,
    particleCount: 90,
    lifetimeMs: 1100,
    palette: ['#78e0bb', '#b3f1de', '#e5fff6'],
    explosionStrategy: 'palm'
  },
  {
    id: 'comet-blue',
    launchSpeed: 410,
    trailLength: 20,
    particleCount: 64,
    lifetimeMs: 980,
    palette: ['#82bbff', '#b7dcff', '#e8f5ff'],
    explosionStrategy: 'comet'
  },
  {
    id: 'crackle-white',
    launchSpeed: 385,
    trailLength: 13,
    particleCount: 102,
    lifetimeMs: 720,
    palette: ['#ffdca8', '#ffe9c4', '#fff8ec'],
    explosionStrategy: 'crackle'
  },
  {
    id: 'fan-scarlet',
    launchSpeed: 365,
    trailLength: 14,
    particleCount: 90,
    lifetimeMs: 1000,
    palette: ['#ff655d', '#ff9284', '#ffd0c7'],
    explosionStrategy: 'fan'
  },
  {
    id: 'strobe-cool',
    launchSpeed: 395,
    trailLength: 11,
    particleCount: 80,
    lifetimeMs: 760,
    palette: ['#95f4ff', '#d0fdff', '#ffffff'],
    explosionStrategy: 'strobe'
  },
  {
    id: 'double-burst-festival',
    launchSpeed: 370,
    trailLength: 17,
    particleCount: 110,
    lifetimeMs: 1040,
    palette: ['#ff7272', '#ffd66a', '#fff4ca'],
    explosionStrategy: 'double-burst'
  }
];
