## ADDED Requirements

### Requirement: Require detail text for each event card
The system SHALL require each event card to include a descriptive detail of what work was performed during that time segment.

#### Scenario: Save event card with detail
- **WHEN** a user provides duration and detail text for a card
- **THEN** the card is saved with that detail text

### Requirement: Validate missing event detail
The system SHALL block saving an event card when detail text is empty.

#### Scenario: Reject blank event detail
- **WHEN** a user attempts to save a card with whitespace-only detail text
- **THEN** the system blocks save and prompts for a meaningful description

### Requirement: Display event-card breakdown in activity details
The system SHALL display each event card's duration and detail text in activity cards so users can review how total time was spent.

#### Scenario: Render multiple event details
- **WHEN** an activity has two saved event cards
- **THEN** the activity card shows both segment rows with their durations and descriptions
