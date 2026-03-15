<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template placeholder -> I. Code Quality Is a Product Feature
- Template placeholder -> II. Tests Prove Behavior
- Template placeholder -> III. Consistent User Experience
- Template placeholder -> IV. Performance Budgets Are Requirements
- Template placeholder -> V. Keep Change Sets Small and Observable
Added sections:
- Engineering Standards
- Delivery Workflow & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
- ✅ updated: .specify/templates/constitution-template.md
- ⚠ pending: .specify/templates/commands/*.md (directory not present in this repository)
Follow-up TODOs:
- None
-->
# Xin Nian Kuai Le Constitution

## Core Principles

### I. Code Quality Is a Product Feature
All production code MUST be readable, typed, and structured around small modules
with explicit responsibilities. Every change MUST leave the touched area in a
better state by removing dead code, clarifying naming, and keeping public APIs
minimal. Lint, type-check, and build failures are release blockers. Rationale:
this project is a time-sensitive interactive experience, so correctness and
maintainability are part of user-facing quality rather than internal cleanup.

### II. Tests Prove Behavior
Behavior-changing work MUST ship with automated tests that fail before the fix or
feature and pass after implementation. Unit tests MUST cover deterministic logic,
integration tests MUST cover user-visible flows or subsystem boundaries, and any
time-sensitive logic MUST be exercised with controlled clocks or fixtures rather
than wall-clock assumptions. Rationale: the countdown, lunar-calendar conversion,
and fireworks state transitions are easy to regress without executable proof.

### III. Consistent User Experience
User-visible changes MUST preserve a coherent visual language, interaction model,
and content style across countdown, fireworks, and debug flows. Specifications
MUST state the intended user journey, empty/error states, localization needs, and
accessibility expectations for text clarity, motion, and input behavior.
Rationale: this project succeeds when the holiday experience feels intentional
and understandable, not when isolated screens are individually polished.

### IV. Performance Budgets Are Requirements
Each feature spec and plan MUST define measurable performance expectations for the
affected path, including startup cost, animation smoothness, and any heavy
computation or rendering work. Implementations MUST avoid unbounded work on the
main thread and MUST verify that animation-heavy paths remain smooth on target
devices before release. Rationale: the core experience is a 10-minute fireworks
display, and dropped frames or delayed transitions directly damage the product.

### V. Keep Change Sets Small and Observable
Work MUST be delivered in small, reviewable increments with clear logging or
debuggability at important state transitions. Plans, tasks, and pull requests
MUST identify risks, validation steps, and rollback-friendly boundaries rather
than bundling unrelated refactors. Rationale: small observable changes reduce the
cost of diagnosing regressions in state machines, time handling, and rendering.

## Engineering Standards

- TypeScript strictness, build correctness, and reproducible local verification
  are mandatory for all production changes.
- Shared logic for time calculation, lunar calendar data, and fireworks
  orchestration MUST live outside presentation code and remain independently
  testable.
- User-facing text, date formatting, and motion behavior MUST be consistent with
  the established holiday presentation unless a spec explicitly redefines them.
- Performance-sensitive code paths MUST document the relevant budget or limit in
  the feature plan and include the verification approach used during delivery.

## Delivery Workflow & Quality Gates

- Every spec MUST include user scenarios, acceptance criteria, UX consistency
  considerations, and measurable performance outcomes for changed behavior.
- Every implementation plan MUST pass the Constitution Check by naming the tests,
  UX constraints, and performance budgets that will govern the work.
- Every task list MUST include the test work, verification steps, and any
  profiling or manual UX validation required to prove compliance.
- Code review MUST reject changes that lack automated tests, weaken user
  experience consistency, or introduce performance risk without an explicit
  justification and mitigation plan.

## Governance

This constitution supersedes local habits and template defaults. Amendments MUST
document the principle changes, affected templates, and migration impact in the
Sync Impact Report. Semantic versioning applies to this document: MAJOR for
removing or redefining a principle, MINOR for adding a principle or materially
expanding governance, and PATCH for clarifications that do not change expected
behavior. Compliance review is required for every spec, plan, task list, and code
review touching production behavior. Any exception MUST be time-boxed, written
down in the relevant plan or review, and approved with a concrete follow-up.

**Version**: 1.0.0 | **Ratified**: 2026-03-15 | **Last Amended**: 2026-03-15
