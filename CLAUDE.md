# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BatraPrompt is a browser-based teleprompter generator. Users paste a script, set a scrolling speed (words/second), and click **Generate** to produce a standalone, self-contained HTML teleprompter file they can save or share.

The application is deployed on GitHub Pages (no build step). There are no dependencies, no package manager, no bundler.

## Architecture

The app has four root files:

- **[index.html](index.html)** — landing page; uses the GitHub Contents API to list generated files organized by user directory
- **[generator.html](generator.html)** — main editor UI (text input, speed/font controls, live stage preview)
- **[script.js](script.js)** — all application logic (see below)
- **[styles.css](styles.css)** — unified dark-theme styling for both pages

### script.js internals

The script manages two distinct concerns:

1. **Live preview** — a `requestAnimationFrame` loop driven by a state object (`isRunning`, `isPaused`, `speedWordsPerSec`, `offsetY`, `rafId`, `lastTs`). Speed is converted from words/second → pixels/second by measuring the rendered pixel width of a sample word at runtime. Keyboard shortcuts: `Space` = pause/resume, `R` = reset.

2. **Generator** — on "Generate", it serialises the current text and settings, then injects them into a minified self-contained HTML template (inline CSS + JS) and triggers a download with a timestamped filename (`teleprompter-YYYY-MM-DDTHH-MM-SS-Z.html`). Generated files are fully standalone — they replicate the animation loop and embed the content directly.

### User directories

`/Amélie/`, `/AnneSophie/`, `/Emmanuelle/`, `/MarieAnne/`, `/Thomas/` are organisational containers for previously generated teleprompter HTML files, one directory per user. They are not part of the application source — just stored outputs.

## Development

Open any `.html` file directly in a browser — no server required. The landing page's GitHub API call (`index.html`) requires an internet connection and will only list files once they are pushed to the repository.

There are no tests, no linter, and no build commands.
