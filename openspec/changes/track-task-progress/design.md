## Context

TimeKeeper currently tracks task name and time spent but has no explicit notion of completion progress. The change spans multiple UI modules (entry form, list, and statistics) plus shared state in the main app component, so documenting a consistent data contract prevents drift between components.

## Goals / Non-Goals

**Goals:**
- Introduce a single, validated progress value per task/time entry in the range `0-100`.
- Ensure users can create and update progress with minimal friction in the existing workflow.
- Surface progress consistently in list and statistics views.
- Preserve compatibility with existing local data by defaulting missing progress values safely.

**Non-Goals:**
- No backend persistence or multi-device sync.
- No advanced planning features (milestones, burndown charts, dependencies).
- No historical progress timeline per task revision.

## Decisions

1. Data model extension: add `progress` (integer percentage) to each time entry object.
- Rationale: keeps progress colocated with entry data already used by current UI.
- Alternative considered: separate task-progress map keyed by task name; rejected because it complicates updates and migration for little benefit.

2. Validation boundary: enforce progress constraints at form input and state update layers.
- Rationale: dual-layer validation protects against both user input mistakes and programmatic inconsistencies.
- Alternative considered: form-only validation; rejected because external state mutations could still create invalid values.

3. Backward compatibility strategy: when reading existing entries without `progress`, treat as `0`.
- Rationale: avoids breaking existing local data and enables gradual adoption.
- Alternative considered: forcing migration prompt; rejected to keep UX simple.

4. Statistics strategy: add derived metrics using existing in-memory aggregation.
- Rationale: current app already computes summary values; extending this path avoids new dependencies and architectural complexity.
- Alternative considered: introducing a dedicated analytics layer; rejected as over-engineering for current scope.

## Risks / Trade-offs

- [Risk] Users may interpret progress differently (time-based vs outcome-based) -> Mitigation: label field clearly as task completion percentage and keep value range explicit.
- [Risk] Existing entries defaulting to `0` can temporarily lower average progress -> Mitigation: communicate through UI labels and optionally exclude empty/default tasks in future iteration.
- [Trade-off] Storing progress on each entry is simple but can duplicate values for repeated tasks -> Mitigation: acceptable for current single-user/local model; revisit if normalized task entities are introduced later.

## Migration Plan

- Update entry schema in app state handling to include `progress`.
- On load/read paths, normalize missing `progress` to `0`.
- Release UI updates for form, list, and statistics in one deploy so users see coherent behavior.
- Rollback strategy: if needed, ignore `progress` field in rendering and state updates; existing records remain readable because additional field is non-breaking.

## Open Questions

- Should completed-task statistics count only `progress === 100`, or include a configurable threshold (for example, `>= 95`)?
- Should progress support decimals, or remain integer-only for clarity and simpler validation?
