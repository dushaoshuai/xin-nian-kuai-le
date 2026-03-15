import type { SceneRenderState, ViewportSize } from '../sceneTypes';

export function renderHorizon(
  ctx: CanvasRenderingContext2D,
  viewport: ViewportSize,
  state: SceneRenderState
): void {
  if (!state.horizonVisible) {
    return;
  }

  const groundHeight = Math.max(18, viewport.height * 0.055);
  const topY = state.horizonY;

  const gradient = ctx.createLinearGradient(0, topY, 0, topY + groundHeight);
  gradient.addColorStop(0, 'rgba(255, 212, 166, 0.08)');
  gradient.addColorStop(0.35, 'rgba(178, 70, 44, 0.12)');
  gradient.addColorStop(1, 'rgba(34, 15, 14, 0.18)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, topY, viewport.width, groundHeight);

  ctx.strokeStyle = 'rgba(255, 225, 196, 0.42)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, topY + 0.5);
  ctx.lineTo(viewport.width, topY + 0.5);
  ctx.stroke();
}
