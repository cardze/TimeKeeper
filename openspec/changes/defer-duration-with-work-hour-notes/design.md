## Context

The current activity creation form uses one top-level duration value, which loses detail when work is split across multiple sub-tasks. This change introduces event cards so users can capture segment-level duration plus details, while the app computes activity totals from those segments.

## Goals / Non-Goals

**Goals:**
- Replace top-level duration entry with event-card input.
- Require each event card to capture both segment duration and description.
- Compute top-level activity duration from event-card totals for list and statistics usage.
- Preserve compatibility with existing entries that only have top-level duration.

**Non-Goals:**
- No backend data model or API changes.
- No automatic duration estimation based on text.
- No timer/start-stop workflow in this change.

## Decisions

1. Introduce `eventCards` on each activity entry, where each card contains `duration` and `detail`.
- Rationale: Models real workflows with multiple time segments while preserving auditability.
- Alternative considered: one large free-text note plus total duration; rejected because it loses segment-level structure.

2. Derive activity duration as `sum(eventCards[].duration)`.
- Rationale: Ensures totals are consistent with the detailed segments users entered.
- Alternative considered: storing independent top-level duration plus cards; rejected because values can drift and conflict.

3. Require each event card to include descriptive detail text.
- Rationale: Duration alone is insufficient; users need to know what happened in each segment.
- Alternative considered: optional detail field; rejected because it weakens usefulness of event cards.

4. Backward compatibility: legacy entries without `eventCards` keep existing top-level duration and can be incrementally migrated in edit flow.
- Rationale: avoids breaking existing saved data and keeps rollout low-risk.
- Alternative considered: mandatory migration on load; rejected as unnecessary complexity for local storage data.

## Risks / Trade-offs

- [Risk] Users may add many event cards, making cards visually heavy -> Mitigation: cap initial visible cards and support concise formatting.
- [Risk] Segment durations might be entered inconsistently -> Mitigation: validate positive numeric durations per card and display computed total in real time.
- [Trade-off] Structured event cards add input steps compared to one duration box -> Mitigation: provide quick add/remove controls and sensible defaults.

## Migration Plan

- Extend entry data contract with `eventCards` and derived total duration behavior.
- Update form/edit UI to create and manage event-card rows.
- Maintain legacy top-level duration support for pre-existing entries.
- Deploy state, list, and statistics updates together to avoid mixed-calculation issues.
- Rollback strategy: continue reading top-level duration and ignore event-card rendering if feature is rolled back.

## Open Questions

- Should there be a maximum number of event cards per activity for performance/usability?
- Should event card descriptions have a minimum length to maintain useful detail quality?
