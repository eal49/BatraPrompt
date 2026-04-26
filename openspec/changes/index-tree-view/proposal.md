# Proposal: Index Tree View

## Intent

Replace the current card grid on the homepage with a collapsible tree-style
list. Each user directory is a collapsible section header; files appear as
compact full-width rows beneath it. Filenames are displayed without the `.html`
extension.

## Problem

The current grid of large cards is hard to scan, especially for Thomas (83 files)
and Emmanuelle (33 files). The cards take up too much space and give every file
equal visual weight regardless of list length.

## Scope

- Replace `.landing__group-files` card grid with a compact list of row links
- Make each user section collapsible (open by default)
- Strip `.html` extension from the displayed label (href unchanged)
- Update CSS to support the new layout (tree lines, row hover, toggle chevron)
- No changes to files.json, the Action, generator, or any teleprompter logic

## Approach

Use a native `<details>`/`<summary>` element per user section — zero JS,
browser-native collapse/expand, keyboard accessible. The file rows become
`<a>` elements styled as thin full-width list items with a right-pointing
arrow that flips to indicate direction.
