# Design: GitHub Actions File Manifest

## Architecture

```
push to main
     │
     ▼
.github/workflows/generate-manifest.yml
     │  (runs Node.js script or shell)
     ├─ walk user dirs: Amélie/ AnneSophie/ Emmanuelle/ MarieAnne/ Thomas/
     ├─ collect .html files (exclude index.html, generator.html)
     ├─ write files.json to repo root
     └─ git commit + push (if changed)
            │
            ▼  (github-actions[bot] commit — skipped by workflow guard)
     GitHub Pages serves updated files.json

index.html (browser)
     └─ fetch('./files.json')   ← replaces api.github.com call
           └─ render grouped by user directory
```

## files.json Structure

```json
{
  "Amélie": ["teleprompter-2025-01-01T10-00-00-Z.html"],
  "AnneSophie": ["teleprompter-2025-02-15T14-30-00-Z.html"],
  "Emmanuelle": ["file1.html", "file2.html"],
  "MarieAnne": [],
  "Thomas": []
}
```

Keys are the known user directory names. Empty arrays are included so
the UI can show all users even if they have no files yet.

## GitHub Action Design

- **Trigger**: `push` to `main`, only when `!= github-actions[bot]` (prevents loop)
- **Permissions**: `contents: write`
- **Script**: inline shell using `find` + `jq` — no external deps, no checkout of Node modules
- **Commit message**: `chore: regenerate files.json [skip ci]`  
  (`[skip ci]` is a secondary loop-prevention guard supported by GitHub Actions)

## index.html Changes

The `fetchHtmlFiles()` function is replaced with `fetchManifest()`:

```js
async function fetchManifest() {
  const resp = await fetch('./files.json');
  if (!resp.ok) return {};
  return resp.json();   // { userName: [filename, ...], ... }
}
```

The `render()` function changes from a flat list to grouped sections:

```html
<section>
  <h2>Amélie</h2>
  <a href="Amélie/file.html">file.html</a>
  ...
</section>
```

## Fallback

If `files.json` is missing (e.g. first deploy before action runs),
`index.html` shows the existing empty-state message. No crash.
