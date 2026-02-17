# Repository Guidelines

## Project Structure & Module Organization
- `src/main.ts`: app bootstrap and animation loop.
- `src/core/`: time/state logic (`timeService.ts`, `stateMachine.ts`, lunar date helpers).
- `src/fireworks/`: firework engine, factory, registry, and strategies.
- `src/ui/`: theme and time-panel rendering.
- `src/debug/`: debug-time URL parsing.
- `src/styles.css`: global visual system and responsive rules.
- `test/`: Vitest tests (currently `timeService.test.ts`).
- `public/`: static assets served directly.
- `.github/workflows/`: CI and Pages deployment workflows.

## Build, Test, and Development Commands
- `npm run dev`: start local Vite dev server with HMR.
- `npm run test`: run Vitest test suite once.
- `npm run build`: type-check (`tsc -b`) and build production bundle (`vite build`).
- `npm run preview`: serve the production build locally.

Example:
```bash
npm install
npm run dev
```

## Coding Style & Naming Conventions
- Language: TypeScript + CSS (vanilla Vite project).
- Indentation: 2 spaces; keep code ASCII unless file already requires Unicode.
- Naming:
  - `camelCase` for variables/functions.
  - `PascalCase` for classes/types.
  - Files use descriptive lowercase names (e.g., `timeService.ts`, `stateMachine.ts`).
- Keep modules focused (time logic in `core`, rendering in `fireworks`/`ui`).
- No formatter/linter is enforced in scripts; keep style consistent with existing files.

## Testing Guidelines
- Framework: Vitest (`npm run test`).
- Place tests in `test/` and name as `*.test.ts`.
- Add tests for date boundaries, state transitions, and formatting when changing `src/core/*`.
- Prefer deterministic time inputs (fixed timestamps with `+08:00` when testing Beijing time behavior).

## Commit & Pull Request Guidelines
- Current history is concise and imperative (e.g., `Initial commit`, `Update header formatting...`).
- Use short imperative commit titles, optionally scoped, e.g.:
  - `Fix countdown background contrast`
  - `Update lunar festival display rules`
- PRs should include:
  - What changed and why.
  - Affected files/modules.
  - Test/build results (`npm run test`, `npm run build`).
  - Screenshots/GIFs for visual changes (theme, typography, animation).

## Configuration Tips
- Timezone logic is Beijing-centric; keep `Asia/Shanghai` semantics when modifying time code.
- Debug helpers rely on URL params (e.g., `?debugTime=...`, `?forceClickFireworks=1`). Preserve compatibility unless intentionally changing behavior.
