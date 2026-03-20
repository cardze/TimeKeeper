## 1. State Normalization and Data Contract

- [x] 1.1 Extend src/App.js entry model to support `eventCards` where each card has `duration` and `detail`.
- [x] 1.2 Implement derived total duration in src/App.js as the sum of event-card durations, with backward compatibility for legacy top-level duration entries.

## 2. New Activity Form Changes

- [x] 2.1 Replace single duration input in src/components/TimeEntryForm.js with dynamic event-card rows.
- [x] 2.2 Enforce validation in src/components/TimeEntryForm.js so each event card requires positive duration and non-empty detail text.
- [x] 2.3 Update src/components/TimeEntryForm.css for readable event-card inputs and add/remove controls on desktop and mobile.

## 3. Entry List and Edit Flow

- [x] 3.1 Update src/components/TimeList.js to display event-card breakdown (segment duration + detail) for each activity.
- [x] 3.2 Extend src/components/TimeList.js edit flow to add, edit, and remove event cards while keeping computed totals accurate.
- [x] 3.3 Update src/components/TimeList.css so event-card detail blocks remain readable and scannable.

## 4. Statistics Safety

- [x] 4.1 Update src/components/Statistics.js to consume derived durations from event-card totals.
- [x] 4.2 Verify statistics remain stable for mixed datasets (legacy entries and event-card entries) without NaN or crashes.

## 5. Verification

- [ ] 5.1 Manually verify users can add multiple event cards during activity creation.
- [ ] 5.2 Manually verify blank event detail or non-positive duration is rejected.
- [ ] 5.3 Manually verify activity total duration equals the sum of event-card durations.
- [ ] 5.4 Manually verify event-card detail rows render correctly in activity cards.
- [x] 5.5 Run smoke checks (build/test) and confirm no regression in existing tracking behavior.
