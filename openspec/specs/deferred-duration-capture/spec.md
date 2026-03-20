## ADDED Requirements

### Requirement: Capture activity time as event cards
The system SHALL allow users to add one or more event cards for an activity, where each card includes a positive duration value.

#### Scenario: Add multiple event cards
- **WHEN** a user enters three event cards with valid durations
- **THEN** the activity stores all three cards as structured segments

### Requirement: Derive total duration from event cards
The system SHALL compute each activity total duration as the sum of all event-card durations.

#### Scenario: Compute total from card durations
- **WHEN** event cards for one activity have durations `15`, `40`, and `20`
- **THEN** the activity total duration is shown as `75`

### Requirement: Validate event-card durations
The system SHALL reject event cards with missing, zero, or negative duration values.

#### Scenario: Reject invalid card duration
- **WHEN** a user attempts to save an event card with duration `0`
- **THEN** the system blocks save and shows a validation message

### Requirement: Preserve legacy duration compatibility
The system SHALL continue to support existing entries that only have top-level duration values.

#### Scenario: Load legacy entry without event cards
- **WHEN** an existing entry has top-level duration and no event cards
- **THEN** the entry remains visible and is included in calculations without runtime errors