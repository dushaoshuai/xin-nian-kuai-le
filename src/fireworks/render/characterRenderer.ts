import type { SceneRenderState } from '../sceneTypes';

export function renderCharacter(ctx: CanvasRenderingContext2D, state: SceneRenderState): void {
  if (!state.runnerVisible || state.runnerOpacity <= 0) {
    return;
  }

  const direction = state.facing === 'right' ? 1 : -1;
  const bodyHeight = 22;
  const headRadius = 4.8;
  const footY = state.runnerY;
  const hipY = footY - bodyHeight;
  const shoulderY = hipY - 9;
  const headY = shoulderY - headRadius - 2;
  const stride = state.phase === 'running-to-launch' || state.phase === 'running-back' ? 4.8 : 1.8;

  ctx.save();
  ctx.globalAlpha = Math.min(1, state.runnerOpacity);

  ctx.beginPath();
  ctx.ellipse(state.runnerX, footY + 2.5, 11, 2.8, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(54, 18, 15, 0.18)';
  ctx.fill();

  ctx.translate(state.runnerX, 0);

  ctx.fillStyle = '#f8d8bf';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.arc(0, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cf5849';
  ctx.beginPath();
  ctx.moveTo(0, shoulderY + 1);
  ctx.lineTo(7.5, hipY + 2);
  ctx.lineTo(0, footY - 3);
  ctx.lineTo(-7.5, hipY + 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#9d2e2a';
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(0, hipY);
  ctx.stroke();

  ctx.strokeStyle = '#ffd36c';
  ctx.beginPath();
  ctx.moveTo(0, shoulderY + 2);
  ctx.lineTo(direction * 8, shoulderY + 9);
  ctx.moveTo(0, shoulderY + 3);
  ctx.lineTo(direction * -5.5, shoulderY + 10);
  ctx.stroke();

  ctx.strokeStyle = '#f2c14e';
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(direction * stride, footY);
  ctx.moveTo(0, hipY);
  ctx.lineTo(direction * -stride, footY - 1);
  ctx.stroke();

  ctx.restore();
}
