# Tasks

## 1. GitHub Action
- [x] 1.1 Create `.github/workflows/generate-manifest.yml` with push-to-main trigger and loop guard
- [x] 1.2 Write shell script in the action that walks user dirs and produces `files.json`
- [x] 1.3 Add git commit+push step (only if `files.json` changed)

## 2. index.html
- [x] 2.1 Replace `fetchHtmlFiles()` with `fetchManifest()` that reads `./files.json`
- [x] 2.2 Update `render()` to display files grouped by user directory with section headings
- [x] 2.3 Ensure empty/missing manifest shows the existing empty-state gracefully

## 3. Seed
- [x] 3.1 Generate initial `files.json` by scanning current user directories
