# Quickstart: Runner Firework Scene

## Prerequisites

- Node.js version compatible with the existing Vite and TypeScript toolchain
- Project dependencies installed with `npm install`

## Implement

1. Create scene-specific types under `src/fireworks/` for runner phases, grounded positions, and render state.
2. Implement a `FireworkSceneController` that owns sequence transitions, launch gating, interruption cleanup, and viewport-safe position calculation.
3. Add horizon and runner render helpers under `src/fireworks/render/`.
4. Integrate the controller into `src/main.ts` so both auto-show launches and pointer launches flow through the same sequence contract.
5. Keep `FireworkEngine` focused on rockets and particles, only exposing the launch entry points the controller needs.

## Test

1. Add Vitest coverage for:
   - accepted launch progressing through all phases
   - firework dispatch only after launch-ready
   - interruption resolving cleanly
   - viewport-safe grounded positions
2. Run:

```bash
npm run test
```

## Verify

1. Start the app:

```bash
npm run dev
```

2. Validate on a desktop-width viewport:
   - runner fades in smoothly
   - runner runs a visible short distance before launch
   - firework launches only after the run-in completes
   - runner returns to origin and fades out smoothly
   - horizon remains visible and does not distract from fireworks
3. Validate on a mobile-width viewport:
   - full sequence remains on screen
   - countdown and other text remain readable
   - no overlapping runners appear during repeated interactions

## Final Validation

Run the production verification path before completion:

```bash
npm run build
```
