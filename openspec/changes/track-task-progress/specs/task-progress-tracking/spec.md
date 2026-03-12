## ADDED Requirements

### Requirement: Capture task progress percentage
The system SHALL allow users to provide a task progress percentage for each time entry, and the stored value MUST be an integer from 0 to 100 inclusive.

#### Scenario: User enters valid progress while creating an entry
- **WHEN** a user submits a time entry with progress value `45`
- **THEN** the entry is saved with `progress` set to `45`

#### Scenario: User enters out-of-range progress
- **WHEN** a user attempts to submit progress less than `0` or greater than `100`
- **THEN** the system rejects submission and shows a validation message

### Requirement: Preserve compatibility with existing entries
The system SHALL support existing saved entries that do not include a progress field by normalizing them to a default progress value of `0`.

#### Scenario: Load legacy entry without progress
- **WHEN** the app loads a previously saved entry that has no `progress` property
- **THEN** the app treats the entry progress as `0` for display and calculations

### Requirement: Display progress in task list
The system SHALL display each entry's progress percentage in the task list view.

#### Scenario: Render task list with progress
- **WHEN** the task list is rendered for entries with progress values
- **THEN** each entry row shows the corresponding progress percentage

### Requirement: Include progress in summary statistics
The system SHALL compute and display progress-oriented summary metrics, including average progress and count of completed tasks.

#### Scenario: Calculate average progress
- **WHEN** statistics are generated for a set of entries with progress values
- **THEN** the average progress metric is shown based on those values

#### Scenario: Count completed tasks
- **WHEN** statistics are generated and entries with `progress` equal to `100` exist
- **THEN** the completed-task count includes those entries
