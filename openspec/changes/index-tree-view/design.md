# Design: Index Tree View

## Rendered Structure

```
▼ EMMANUELLE  33 files
  │  écuries                               →
  │  écuriesAugiasBL1                      →
  │  écuriesAugiasBL2                      →

▼ THOMAS  83 files
  │  cerbereBL                             →
  │  cerbereLM1                            →
```

## HTML Structure

Each user section becomes a `<details open>` with a `<summary>` header.
Files are `<a>` elements inside a `<div class="landing__tree">`:

```html
<details class="landing__group" open>
  <summary class="landing__group-title">
    <span class="landing__group-name">Emmanuelle</span>
    <span class="landing__group-count">33 files</span>
  </summary>
  <div class="landing__tree">
    <a class="landing__row" href="Emmanuelle/écuries.html">écuries</a>
    <a class="landing__row" href="Emmanuelle/écuriesAugiasBL1.html">écuriesAugiasBL1</a>
  </div>
</details>
```

## CSS Changes

- `.landing__list` — keep `flex column`, adjust gap
- `.landing__group` — remove card styling, use `<details>` default + custom marker
- `.landing__group-title` (now `<summary>`) — flex row, chevron rotates on open
- `.landing__tree` — left border line connecting rows
- `.landing__row` — full-width thin link, right arrow, hover highlight
- Remove `.landing__group-files` (replaced by `.landing__tree`)
- Remove old `.landing__item` card styles (keep class for compatibility if needed)

## Display Name

Strip `.html` suffix in JS: `f.replace(/\.html$/i, '')` for the link text.
The `href` keeps the full filename unchanged.

## Collapse Behaviour

`<details open>` = expanded by default. User clicks summary to collapse.
No JS required. Browser persists state within the session natively.
