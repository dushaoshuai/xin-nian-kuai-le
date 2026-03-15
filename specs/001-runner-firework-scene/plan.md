# Implementation Plan: Runner Firework Scene

**Branch**: `001-runner-firework-scene` | **Date**: 2026-03-15 | **Spec**: [/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/spec.md](/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/spec.md)
**Input**: Feature specification from `/specs/001-runner-firework-scene/spec.md`

## Summary

Add a character-led firework launch sequence to the existing canvas-based New Year experience. The implementation will keep the current TypeScript + Vite architecture, introduce a small scene orchestration layer for character lifecycle and horizon rendering, and preserve the existing firework particle engine as the launch/explosion subsystem. The design prioritizes smooth animation, explicit state transitions, and minimal disruption to current countdown and show behavior.

## Technical Context

**Language/Version**: TypeScript 5.7, CSS, browser Canvas 2D  
**Primary Dependencies**: Vite 6, Vitest 3, lunar-typescript  
**Storage**: N/A  
**Testing**: Vitest unit tests for deterministic scene sequencing and firework gating, plus manual browser validation for desktop/mobile animation flow  
**Target Platform**: Modern desktop and mobile browsers  
**Project Type**: Single-project web application with a canvas-rendered interactive scene  
**Performance Goals**: Maintain visually smooth animation throughout the runner entry-launch-return sequence, target 55+ fps during standard show playback, and avoid visible hitching across five consecutive launches  
**Constraints**: Preserve existing holiday visual language; avoid sudden pop-in/pop-out; keep text overlays readable; no heavyweight runtime dependencies; keep launch timing deterministic enough for automated state tests  
**Scale/Scope**: One new grounded character sequence layered into the existing fireworks experience, one persistent horizon element, and targeted updates to the firework rendering/orchestration modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: The change will stay modular by keeping orchestration logic in a dedicated fireworks scene controller, keeping drawing primitives in rendering-focused modules, and limiting `main.ts` to wiring and frame progression. TypeScript build correctness remains mandatory through `npm run build`.
- **Testing**: Automated coverage will add deterministic tests for sequence state progression, launch gating, interrupt cleanup, and viewport-safe positioning. Manual validation will confirm desktop and mobile scene readability plus smooth entry/exit behavior.
- **User Experience Consistency**: The user journey remains countdown or show state into fireworks display, now with a small runner appearing at ground level, running to launch, returning, and fading out. The character and horizon must remain subtle, readable, and compatible with existing motion and text overlays.
- **Performance**: The sequence must keep the animation path smooth during normal playback, with manual validation across five consecutive launches and no evidence of visible phase drops or stutter under standard desktop-width and mobile-width viewports.
- **Observability/Change Scope**: The work will remain reviewable by isolating new state transitions behind a single controller interface, using debug-friendly deterministic state names, and avoiding unrelated refactors to time or theme modules.

## Project Structure

### Documentation (this feature)

```text
specs/001-runner-firework-scene/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── firework-scene-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── core/
│   ├── lunarNewYearTable.ts
│   ├── stateMachine.ts
│   ├── timeService.ts
│   └── types.ts
├── debug/
│   └── debugTime.ts
├── fireworks/
│   ├── engine.ts
│   ├── factory.ts
│   ├── registry.ts
│   ├── types.ts
│   ├── sceneController.ts
│   ├── sceneTypes.ts
│   └── render/
│       ├── characterRenderer.ts
│       └── horizonRenderer.ts
├── ui/
│   ├── theme.ts
│   └── timePanel.ts
├── main.ts
└── styles.css

test/
├── fireworkSceneController.test.ts
└── timeService.test.ts
```

**Structure Decision**: Keep the current single-project Vite app and extend the `src/fireworks/` area with a scene controller plus small rendering helpers. This keeps animation-specific logic near the existing firework engine and avoids mixing runner state transitions into generic UI or time modules.

## Phase 0: Research

Research outputs are captured in [research.md](/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/research.md). The key decisions are:

1. Preserve the current TypeScript + Canvas 2D stack rather than introducing a scene framework.
2. Add an explicit sequence state machine for the runner lifecycle so tests can validate launch timing and interruption recovery deterministically.
3. Render the horizon and character as lightweight scene layers inside the existing animation frame rather than through DOM overlays.

## Phase 1: Design & Contracts

### Architecture

Introduce a `FireworkSceneController` responsible for:

- Maintaining a single active runner sequence with explicit phases: hidden, fading-in, running-to-launch, launching, running-back, fading-out.
- Choosing grounded start and launch positions within viewport-safe bounds.
- Triggering firework launch only when the sequence reaches the launch-ready phase.
- Handling interrupted or overlapping launch requests by either queueing the next launch or rejecting it cleanly based on current scene state.
- Exposing render data for the character and horizon so drawing remains separate from sequencing logic.

The existing `FireworkEngine` remains responsible for:

- Rocket launch and particle simulation.
- Core frame update and render timing.
- Existing debug state inspection for rockets and particles.

`main.ts` will be updated to:

- Construct the scene controller alongside the firework engine.
- Route auto-show launches and pointer-triggered launches through the scene controller instead of launching fireworks directly.
- Continue driving a single `requestAnimationFrame` loop while updating and rendering both the sky and the grounded scene elements in a fixed order.

### Design Decisions

- Use the existing browser canvas and frame loop because the project is already optimized around that model and the feature needs tight frame-to-frame coordination.
- Add a small internal state machine for the runner sequence to make behavior observable, testable, and resilient to cancellation.
- Keep the horizon subtle and persistent so it grounds motion without competing with fireworks or text overlays.
- Favor deterministic timing constants for runner phases so automated tests can verify transitions without relying on real wall-clock jitter.

### Data Model

Detailed entities and state transitions are defined in [data-model.md](/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/data-model.md).

### Contracts

The UI-facing scene behavior contract is defined in [firework-scene-contract.md](/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/contracts/firework-scene-contract.md).

### Quickstart

Implementation and validation workflow is documented in [quickstart.md](/Users/yskj/dev/github.com/dushaoshuai/xin-nian-kuai-le/specs/001-runner-firework-scene/quickstart.md).

## Phase 2: Implementation Strategy

1. Extend the fireworks subsystem with scene-specific types that describe runner phases, grounded positions, and render payloads.
2. Implement the `FireworkSceneController` to own lifecycle transitions, launch gating, interruption cleanup, and viewport-safe position calculation.
3. Add lightweight render helpers for the horizon and the runner silhouette, keeping drawing code separate from update logic.
4. Integrate the controller into `main.ts` and adapt auto-show and pointer-triggered launches to flow through it.
5. Add Vitest coverage for deterministic sequence transitions, launch timing, and interruption/overlap handling.
6. Run build and tests, then perform manual browser validation for desktop and mobile viewport behavior.

## Post-Design Constitution Check

- **Code Quality**: Pass. The design isolates new behavior in `src/fireworks/` and keeps rendering helpers separate from orchestration logic.
- **Testing**: Pass. The plan names new automated tests plus manual animation checks.
- **User Experience Consistency**: Pass. The sequence, horizon, and readability constraints are explicit and tied to existing holiday presentation rules.
- **Performance**: Pass. The design avoids new frameworks, keeps rendering in the existing frame loop, and defines validation for animation smoothness.
- **Observability/Change Scope**: Pass. The change is constrained to fireworks orchestration/rendering and remains debuggable through explicit sequence states and small module boundaries.

## Complexity Tracking

No constitution violations or exceptional complexity are anticipated for this feature.
