# Delta for File Manifest

## ADDED Requirements

### Requirement: Manifest File Generation
The system SHALL generate a `files.json` at the repo root on every push to `main`,
listing all `.html` files in user subdirectories, grouped by directory name.

#### Scenario: New file uploaded
- GIVEN a user commits a new `.html` file to a user subdirectory
- WHEN the push reaches `main`
- THEN the GitHub Action regenerates `files.json` within the same workflow run
- AND commits the updated `files.json` back to `main`
- AND the GitHub Pages homepage reflects the new file on next load

#### Scenario: No file changes
- GIVEN a push to `main` that does not change any `.html` files
- WHEN the Action runs
- THEN no commit is made (no noise in git history)

### Requirement: Local Manifest Consumption
The homepage SHALL fetch `./files.json` (same-origin) instead of calling the
GitHub Contents API.

### Requirement: Grouped Display
The homepage SHALL render files grouped by user directory, with a heading per user
and links to individual files beneath it.

#### Scenario: Multiple users with files
- GIVEN `files.json` contains entries for multiple users
- WHEN the homepage loads
- THEN each user appears as a separate section with their files listed below

#### Scenario: Empty manifest or fetch failure
- GIVEN `files.json` is missing or returns an error
- WHEN the homepage loads
- THEN the existing empty-state message is shown, no crash occurs
