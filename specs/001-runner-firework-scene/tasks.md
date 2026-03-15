# Tasks: Runner Firework Scene

**Input**: Design documents from `/specs/001-runner-firework-scene/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks are REQUIRED for this behavior-changing feature. Include automated Vitest coverage and manual browser validation per the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project paths are used: `src/` and `test/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature scaffolding and align the repo with the planned file layout

- [X] T001 Create scene module scaffolding in `src/fireworks/sceneTypes.ts`, `src/fireworks/sceneController.ts`, `src/fireworks/render/characterRenderer.ts`, and `src/fireworks/render/horizonRenderer.ts`
- [X] T002 [P] Create feature test scaffold in `test/fireworkSceneController.test.ts`
- [X] T003 [P] Review and align feature documentation references in `specs/001-runner-firework-scene/quickstart.md` and `specs/001-runner-firework-scene/contracts/firework-scene-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared scene types and integration seams required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define shared runner sequence, grounded path, and render state types in `src/fireworks/sceneTypes.ts`
- [X] T005 [P] Extend firework launch integration types and hook points in `src/fireworks/types.ts` and `src/fireworks/engine.ts`
- [X] T006 Create the initial `FireworkSceneController` interface and deterministic phase constants in `src/fireworks/sceneController.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Character-led Firework Launch (Priority: P1) 🎯 MVP

**Goal**: Introduce a runner-controlled launch sequence that appears, runs to launch position, triggers the firework, returns, and exits cleanly

**Independent Test**: Trigger a standard firework launch and confirm the runner appears, runs a short distance, launches only after reaching the launch position, returns to the origin, and is cleared from the scene at the end

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] [US1] Add sequence progression and launch-gating unit tests in `test/fireworkSceneController.test.ts`
- [X] T008 [P] [US1] Add interruption and overlap handling unit tests in `test/fireworkSceneController.test.ts`

### Implementation for User Story 1

- [X] T009 [US1] Implement launch request handling, single-active-sequence rules, and viewport-safe path calculation in `src/fireworks/sceneController.ts`
- [X] T010 [P] [US1] Implement runner position and facing-direction render state generation in `src/fireworks/sceneController.ts`
- [X] T011 [US1] Implement runner silhouette drawing for grounded movement states in `src/fireworks/render/characterRenderer.ts`
- [X] T012 [US1] Integrate the scene controller and runner render flow into `src/main.ts`
- [X] T013 [US1] Connect deferred firework dispatch from the scene controller into `src/fireworks/engine.ts` and `src/main.ts`
- [X] T014 [US1] Verify MVP UX flow and launch ordering against `specs/001-runner-firework-scene/quickstart.md`

**Checkpoint**: User Story 1 should now be fully functional and testable independently

---

## Phase 4: User Story 2 - Smooth Entrance And Exit (Priority: P2)

**Goal**: Make runner appearance and disappearance feel polished through gradual transitions instead of abrupt pop-in or pop-out

**Independent Test**: Observe repeated launches and confirm the runner always fades in at entry and fades out after returning, with no abrupt visibility jumps

### Tests for User Story 2 ⚠️

- [X] T015 [P] [US2] Add opacity transition and end-state cleanup unit tests in `test/fireworkSceneController.test.ts`

### Implementation for User Story 2

- [X] T016 [US2] Implement fade-in, fade-out, and terminal cleanup transitions in `src/fireworks/sceneController.ts`
- [X] T017 [US2] Apply opacity-aware character rendering in `src/fireworks/render/characterRenderer.ts`
- [X] T018 [US2] Tune phase timings and frame-update handling for smooth transitions in `src/fireworks/sceneController.ts` and `src/main.ts`
- [X] T019 [US2] Verify no abrupt pop-in or pop-out across five consecutive launches using `specs/001-runner-firework-scene/quickstart.md`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Grounded Visual Context (Priority: P3)

**Goal**: Add a stable horizon so the runner and launch position feel anchored to a visible ground plane

**Independent Test**: Load the scene on desktop and mobile widths and confirm the horizon remains visible, the runner aligns to it, and existing overlays stay readable

### Tests for User Story 3 ⚠️

- [X] T020 [P] [US3] Add viewport alignment and grounded-position unit tests in `test/fireworkSceneController.test.ts`

### Implementation for User Story 3

- [X] T021 [US3] Implement horizon render state calculation and safe vertical alignment in `src/fireworks/sceneController.ts`
- [X] T022 [P] [US3] Implement persistent horizon drawing in `src/fireworks/render/horizonRenderer.ts`
- [X] T023 [US3] Integrate horizon rendering order and overlay-safe placement in `src/main.ts` and `src/styles.css`
- [X] T024 [US3] Verify grounded readability on desktop-width and mobile-width viewports using `specs/001-runner-firework-scene/quickstart.md`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and cross-story quality checks

- [X] T025 [P] Refine shared scene comments and debug-friendly naming in `src/fireworks/sceneTypes.ts`, `src/fireworks/sceneController.ts`, and `src/main.ts`
- [X] T026 Run automated validation with `npm run test` and `npm run build`
- [X] T027 Perform full manual validation from `specs/001-runner-firework-scene/quickstart.md` and record any follow-up fixes in `specs/001-runner-firework-scene/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 render/controller flow being present
- **User Story 3 (Phase 5)**: Depends on Foundational completion and integrates cleanly after US1 controller wiring
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 and defines the MVP
- **User Story 2 (P2)**: Builds on US1 by refining transition quality and cleanup behavior
- **User Story 3 (P3)**: Uses the same scene controller but can be implemented after the shared foundation and validated once US1 integration is present

### Within Each User Story

- Tests MUST be written and fail before implementation
- Scene types and controller seams before render integration
- Controller logic before `main.ts` wiring
- Render helper updates before final manual UX/performance verification

### Parallel Opportunities

- `T002` and `T003` can run in parallel after `T001`
- `T005` can run in parallel with `T004` before `T006`
- `T007` and `T008` can run in parallel within US1
- `T020` and `T022` can run in parallel once US3 starts
- Final cleanup `T025` can run in parallel with validation prep, but `T026` and `T027` must be the last checks

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 tests together:
Task: "Add sequence progression and launch-gating unit tests in test/fireworkSceneController.test.ts"
Task: "Add interruption and overlap handling unit tests in test/fireworkSceneController.test.ts"

# Split controller and renderer work after the tests exist:
Task: "Implement launch request handling, single-active-sequence rules, and viewport-safe path calculation in src/fireworks/sceneController.ts"
Task: "Implement runner silhouette drawing for grounded movement states in src/fireworks/render/characterRenderer.ts"
```

---

## Parallel Example: User Story 3

```bash
# Build grounded visuals in parallel:
Task: "Add viewport alignment and grounded-position unit tests in test/fireworkSceneController.test.ts"
Task: "Implement persistent horizon drawing in src/fireworks/render/horizonRenderer.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate the runner-led launch sequence independently

### Incremental Delivery

1. Deliver US1 for core runner-driven firework launch behavior
2. Add US2 to polish entry and exit transitions without changing core launch sequencing
3. Add US3 to ground the full experience with a visible horizon and responsive placement
4. Finish with automated and manual validation

### Parallel Team Strategy

1. One developer handles controller logic in `src/fireworks/sceneController.ts`
2. One developer handles rendering helpers in `src/fireworks/render/characterRenderer.ts` and `src/fireworks/render/horizonRenderer.ts`
3. One developer handles tests and final `src/main.ts` integration once the controller contract stabilizes

---

## Notes

- [P] tasks indicate different files and minimal dependency overlap
- Each user story is independently testable per the spec
- All task descriptions include exact file paths
- Suggested MVP scope: Phase 3 / User Story 1 only
