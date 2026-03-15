# Research: Runner Firework Scene

## Decision 1: Keep the existing TypeScript + Canvas 2D stack

- **Decision**: Implement the runner and horizon within the current TypeScript + Canvas 2D rendering loop, without adding a new rendering framework or animation library.
- **Rationale**: The project already centers its user-visible behavior on a single animation loop and a custom firework engine. Keeping the same stack minimizes integration risk, preserves performance characteristics, and avoids introducing framework overhead for a small feature slice.
- **Alternatives considered**:
  - Add a DOM/CSS-based runner overlay: rejected because syncing DOM motion with canvas firework timing would add coordination complexity and layering risks.
  - Introduce a canvas scene library: rejected because the feature scope is small and the added dependency would increase maintenance cost for little gain.

## Decision 2: Add a dedicated runner sequence controller

- **Decision**: Create a dedicated scene controller that owns the runner lifecycle, launch gating, interruption handling, and viewport-safe positioning.
- **Rationale**: The feature requires ordered, testable phases: appear, run in, launch, run back, disappear. A dedicated controller provides deterministic transitions that can be unit tested independently from particle simulation and keeps `main.ts` focused on composition.
- **Alternatives considered**:
  - Add ad hoc timing flags directly in `main.ts`: rejected because this would make the frame loop harder to reason about and harder to test.
  - Fold runner state directly into `FireworkEngine`: rejected because rocket/particle simulation and scene choreography are separate responsibilities.

## Decision 3: Model the runner as explicit sequence phases

- **Decision**: Use explicit named phases for the runner sequence, including hidden, fading-in, running-to-launch, launch-ready, running-back, and fading-out.
- **Rationale**: Explicit states make the behavior observable, remove ambiguity around when a firework may launch, and simplify handling interruptions or repeated launch requests.
- **Alternatives considered**:
  - Infer behavior from timer thresholds only: rejected because timer-only logic is harder to debug and more brittle under interruptions.
  - Collapse launch-ready into running states: rejected because the spec requires the launch to happen only after the runner reaches the launch position.

## Decision 4: Render grounded scene elements as lightweight canvas layers

- **Decision**: Draw the horizon and runner as lightweight scene layers within the existing render pass.
- **Rationale**: The horizon is persistent and the runner is tightly tied to the firework launch position, so both benefit from sharing the same coordinate system as rockets and particles.
- **Alternatives considered**:
  - Render the horizon in CSS while the runner stays in canvas: rejected because split coordinate systems complicate responsive alignment.
  - Bake the horizon into the page background only: rejected because the feature requires the character to read as grounded inside the firework scene itself.

## Decision 5: Preserve a single active runner sequence

- **Decision**: Support one active runner sequence at a time for this feature iteration.
- **Rationale**: The spec explicitly avoids overlapping character sequences. A single active sequence reduces ambiguity, protects clarity on small screens, and keeps launch ordering deterministic.
- **Alternatives considered**:
  - Queue and animate multiple runners simultaneously: rejected because it would materially expand choreography, collision handling, and acceptance scope.
  - Drop new launches while busy without clear handling: rejected because interruption behavior should still resolve cleanly and predictably.

## Decision 6: Use deterministic automated tests plus manual visual validation

- **Decision**: Cover sequence logic with Vitest unit tests and validate animation smoothness manually in browser viewports.
- **Rationale**: State progression, launch gating, and interruption cleanup are deterministic enough for automated tests, while animation polish and visual readability still require manual observation.
- **Alternatives considered**:
  - Manual validation only: rejected because constitution requires executable proof for behavior changes.
  - Full screenshot-based animation regression tests: rejected because that would add more infrastructure than the feature currently justifies.
