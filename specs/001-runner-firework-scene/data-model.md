# Data Model: Runner Firework Scene

## RunnerSequence

Represents one complete character-led firework launch lifecycle.

### Fields

- `phase`: Current sequence phase.
- `elapsedMs`: Time accumulated inside the current phase.
- `opacity`: Current character visibility from fully hidden to fully visible.
- `startPosition`: Ground-aligned point where the runner appears and must return.
- `launchPosition`: Ground-aligned point where the runner stops before the firework launches.
- `pendingLaunch`: Whether a firework launch is waiting for the sequence to reach launch-ready.
- `activeConfigId`: Identifier for the firework configuration associated with the sequence.

### Validation Rules

- `startPosition` and `launchPosition` must remain inside viewport-safe bounds.
- `launchPosition` must be visibly separated from `startPosition`.
- `opacity` must remain within the visible transition range and never jump directly from hidden to fully visible or the reverse in a single state change.
- Only one `RunnerSequence` may be active at a time.

### State Transitions

- `hidden` → `fading-in`: Triggered when a launch request is accepted.
- `fading-in` → `running-to-launch`: Triggered when the entrance transition completes.
- `running-to-launch` → `launch-ready`: Triggered when the runner reaches `launchPosition`.
- `launch-ready` → `running-back`: Triggered immediately after the firework launch is dispatched.
- `running-back` → `fading-out`: Triggered when the runner returns to `startPosition`.
- `fading-out` → `hidden`: Triggered when the exit transition completes.
- `any active phase` → `fading-out` or `hidden`: Triggered when the sequence is interrupted and must resolve cleanly.

## GroundPath

Represents the grounded movement path visible to the viewer.

### Fields

- `baselineY`: Vertical position of the ground reference.
- `startX`: Horizontal coordinate of the runner origin.
- `launchX`: Horizontal coordinate of the launch stop.
- `safeInsetX`: Minimum horizontal padding from viewport edges.

### Validation Rules

- `baselineY` must visually align with the horizon.
- `startX` and `launchX` must remain inside visible bounds.
- The horizontal distance between `startX` and `launchX` must be large enough to read as a short run.

## Horizon

Represents the persistent ground boundary used to anchor the runner.

### Fields

- `y`: Vertical position of the horizon line or band.
- `styleVariant`: Chosen visual treatment for the horizon.
- `visibility`: Whether the horizon is currently rendered.

### Validation Rules

- The horizon must remain visible throughout the firework scene.
- The horizon must not obscure existing text overlays.

## SceneRenderState

Represents the draw-ready state consumed by render helpers.

### Fields

- `runnerVisible`: Whether the runner should currently be drawn.
- `runnerX`: Current horizontal position of the runner.
- `runnerY`: Current baseline-aligned vertical position of the runner.
- `runnerOpacity`: Current runner alpha for smooth entrance and exit.
- `facing`: Direction of movement or idle stance.
- `horizonY`: Vertical position used for horizon rendering.

### Relationships

- Derived from `RunnerSequence`, `GroundPath`, and viewport dimensions.
- Consumed by the scene render layer before or after firework rendering depending on desired stacking.
