## Why

Time tracking alone does not show how close a task is to completion, so users cannot quickly judge whether work is on track. Adding task progress visibility now improves daily planning and status communication without leaving the TimeKeeper app.

## What Changes

- Add progress tracking for each task as a percentage from 0 to 100.
- Allow users to set and update progress when creating or editing a time entry.
- Show task progress in the task list alongside existing time data.
- Add basic progress insights in statistics (for example, average progress and completed-task count).
- Persist progress in the same client-side data model used for existing time entries.

## Capabilities

### New Capabilities
- `task-progress-tracking`: Track, update, validate, and display task progress values across entry, list, and statistics views.

### Modified Capabilities
- None.

## Impact

- Affected UI components: [src/components/TimeEntryForm.js](src/components/TimeEntryForm.js), [src/components/TimeList.js](src/components/TimeList.js), [src/components/Statistics.js](src/components/Statistics.js).
- Affected styles: [src/components/TimeEntryForm.css](src/components/TimeEntryForm.css), [src/components/TimeList.css](src/components/TimeList.css), [src/components/Statistics.css](src/components/Statistics.css).
- Affected app state orchestration: [src/App.js](src/App.js).
- No backend/API changes; no new external dependencies expected.
