# Contract: Firework Scene Controller

## Purpose

Define the internal contract between the application frame loop and the new grounded firework scene orchestration.

## Responsibilities

The scene controller must:

- Accept launch requests from auto-show flow and pointer-triggered flow.
- Delay actual firework dispatch until the runner reaches the launch position.
- Maintain at most one active runner sequence at a time.
- Produce deterministic render state for the runner and horizon on every frame update.
- Resolve interruptions into a clean end state without leaving the runner stranded.

## Expected Interface

### `requestLaunch(config, targetX, targetY, source)`

Requests a new firework launch through the character-led sequence.

#### Inputs

- `config`: Firework configuration selected by the registry.
- `targetX`: Horizontal target for the eventual rocket destination.
- `targetY`: Vertical target for the eventual rocket destination.
- `source`: Launch origin category such as auto-show or pointer interaction.

#### Behavioral Guarantees

- If no runner sequence is active, the controller starts a new sequence.
- The controller does not dispatch the firework immediately on request acceptance.
- The controller dispatches the firework exactly once after the runner reaches the launch position.
- If a request cannot be accepted because the scene is busy, the controller returns an explicit rejected or deferred result.

### `update(dtMs, viewport)`

Advances the runner sequence and scene state for one animation frame.

#### Inputs

- `dtMs`: Frame delta in milliseconds, capped by the caller for stability.
- `viewport`: Current visible width and height.

#### Behavioral Guarantees

- Transitions sequence phases in deterministic order.
- Keeps grounded positions inside viewport-safe bounds.
- Produces a clean terminal state after completion or interruption.

### `getRenderState()`

Returns draw-ready state for the current frame.

#### Outputs

- Runner visibility, position, opacity, and facing direction.
- Horizon visibility and vertical position.
- Any optional debug-friendly phase label needed for diagnostics.

## Error and Edge Handling

- Overlapping launches must not create multiple simultaneous runners.
- Interrupted launches must not leave the runner frozen on screen.
- Narrow viewports must still preserve readable start, launch, and return positions.
- The contract must allow the caller to keep text overlays unobstructed by choosing safe grounded positions.

## Acceptance Signals

- Launch only occurs after `running-to-launch` completes.
- Runner disappears only after the return path completes.
- Every accepted launch request reaches either completed or cleanly cancelled terminal state.
