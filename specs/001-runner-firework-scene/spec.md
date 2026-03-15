# Feature Specification: Runner Firework Scene

**Feature Branch**: `001-runner-firework-scene`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: User description: "增加功能，放烟花时要有小人出现，跑动一小段距离，再放烟花，放完烟花，再跑回出现的位置，然后消失。要逐渐出现，逐渐消失，不能生硬地出现和消失。增加地平线。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Character-led Firework Launch (Priority: P1)

As a viewer, I want each firework launch to be introduced by a small character entering the scene, running into position, and launching the firework so the celebration feels more lively and intentional.

**Why this priority**: This is the core value of the request. Without the character entrance, run-in, launch, and exit sequence, the new feature is not delivered.

**Independent Test**: Can be fully tested by triggering a standard firework sequence and confirming that a visible character appears smoothly, runs a short distance, launches the firework from the run destination, then returns to the starting point before disappearing.

**Acceptance Scenarios**:

1. **Given** a firework sequence is about to begin, **When** the launch animation starts, **Then** a small character appears from a fixed ground-level position before the firework is launched.
2. **Given** the small character has appeared, **When** the pre-launch movement plays, **Then** the character runs a short visible distance toward the launch position and the firework is not launched until the character reaches that position.
3. **Given** the firework has finished launching, **When** the post-launch movement plays, **Then** the character runs back to the original appearance position and disappears only after returning.

---

### User Story 2 - Smooth Entrance And Exit (Priority: P2)

As a viewer, I want the small character to fade in and fade out smoothly so the animation feels polished instead of abrupt.

**Why this priority**: The user explicitly asked to avoid hard appearance and disappearance. Smooth transitions are required for the feature to feel intentional.

**Independent Test**: Can be fully tested by observing multiple launches and confirming that the character never pops in or out instantly at the beginning or end of the sequence.

**Acceptance Scenarios**:

1. **Given** the character is entering the scene, **When** the entrance begins, **Then** the character becomes visible through a gradual transition rather than an instant appearance.
2. **Given** the character has returned to the starting point, **When** the exit begins, **Then** the character becomes invisible through a gradual transition rather than an instant disappearance.

---

### User Story 3 - Grounded Visual Context (Priority: P3)

As a viewer, I want a visible horizon in the firework scene so the character and launch position feel anchored to a ground plane instead of floating.

**Why this priority**: The horizon is a supporting visual element that improves scene readability and makes the character movement easier to understand.

**Independent Test**: Can be fully tested by loading the scene and verifying that a visible horizon remains present during the firework experience and provides a stable reference line for character movement.

**Acceptance Scenarios**:

1. **Given** the firework scene is visible, **When** the viewer watches the background before and during launches, **Then** a horizon line or equivalent ground boundary is visible and remains visually stable.
2. **Given** the character performs the launch sequence, **When** the character appears and runs, **Then** the movement is visually aligned with the ground defined by the horizon.

---

### Edge Cases

- If a new firework trigger occurs while a character is still completing the previous launch sequence, the system must prevent overlapping character actions that would make the launch origin or return path unclear.
- If the firework sequence is cancelled, interrupted, or ends early, the character must still leave the scene cleanly without freezing mid-run.
- If the viewport is narrow or short, the horizon and character path must remain visible enough for viewers to understand where the character starts, runs, and returns.
- If the character would otherwise appear off-screen, the system must keep the full entry, launch, and return motion inside the visible scene.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a small character before each supported firework launch sequence begins.
- **FR-002**: The character MUST appear from a consistent ground-level starting position that is visually connected to the scene background.
- **FR-003**: The character MUST transition into view gradually during entrance and MUST NOT appear instantaneously.
- **FR-004**: After appearing, the character MUST run a short visible distance from the starting position to a launch position before the firework is triggered.
- **FR-005**: The firework launch MUST originate only after the character reaches the launch position.
- **FR-006**: After the firework launch action completes, the character MUST run back to the original starting position before leaving the scene.
- **FR-007**: The character MUST transition out of view gradually after returning to the starting position and MUST NOT disappear instantaneously.
- **FR-008**: The system MUST ensure the character's entry path, launch position, return path, and disappearance all remain visually coherent within the visible scene.
- **FR-009**: The system MUST add a horizon or equivalent ground boundary that remains visible throughout the firework scene.
- **FR-010**: The horizon MUST provide a stable visual reference so the character's movement reads as grounded rather than floating.
- **FR-011**: The system MUST avoid overlapping character sequences that would create multiple simultaneous runners for a single launch moment unless the specification is later expanded to support multi-character choreography.
- **FR-012**: If a launch sequence is interrupted or cannot complete normally, the system MUST resolve the character state into a clear end state without leaving the character visibly stuck on screen.

### User Experience Consistency Requirements *(mandatory)*

- **UX-001**: The character, horizon, and related motion MUST align with the existing celebratory visual language and must not visually overpower the fireworks themselves.
- **UX-002**: The scene MUST present understandable transition states for pre-launch entry, run-to-launch, launch completion, run-back, and exit so viewers can follow the sequence without confusion.
- **UX-003**: Motion intensity MUST remain comfortable for viewers by using smooth, readable transitions and by avoiding sudden flashes, jumps, or disorienting placement changes unrelated to the fireworks.
- **UX-004**: Any text, date, or countdown elements already shown in the experience MUST remain readable and must not be obscured by the new horizon or character sequence.

### Performance Requirements *(mandatory)*

- **PR-001**: During a standard firework launch sequence, the combined scene animation MUST remain visually smooth, with the primary motion appearing continuous and without noticeable stutter on a modern desktop browser.
- **PR-002**: Performance validation MUST be performed in the normal fireworks experience on both desktop-width and mobile-width viewports, with the character sequence and horizon enabled.
- **PR-003**: Acceptance evidence MUST include manual validation that the character sequence plays from appearance through disappearance without dropped phases, visible freezing, or obvious frame hitching.

### Key Entities *(include if feature involves data)*

- **Character Sequence**: A viewer-visible animation sequence covering the character's entrance, run to launch position, launch participation, return movement, and exit.
- **Launch Position**: The ground-aligned position where the character stops running and from which the associated firework is visually initiated.
- **Start Position**: The character's original ground-aligned appearance point and the position the character must return to before disappearing.
- **Horizon**: A persistent background element that defines the ground boundary and anchors the character's motion in the scene.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of manually validated launch sequences, viewers can observe the full order of actions: smooth appearance, run-in, firework launch, run-back, and smooth disappearance.
- **SC-002**: In 100% of manually validated launch sequences, the firework does not launch before the character reaches the launch position.
- **SC-003**: In 100% of manually validated launch sequences, the character completes the return path and is not left visible in a broken or stranded state after the sequence ends.
- **SC-004**: In both desktop-width and mobile-width validation, the horizon remains visible during the firework scene and the character's motion reads as grounded.
- **SC-005**: During a five-launch observation run, no launch shows a visibly abrupt character pop-in or pop-out.

## Assumptions

- The feature applies to the standard firework launch experience rather than only to a hidden debug mode.
- A single small character is sufficient for each launch sequence; multi-character behavior is out of scope.
- The requested "run a short distance" is interpreted as movement that is clearly noticeable to viewers without materially delaying the celebration flow.
- The horizon may be subtle, but it must remain visually recognizable throughout the scene.
