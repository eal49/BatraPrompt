# Proposal: QR Code Button on Teleprompter Pages

## Intent

Add a QR button to the control bar of generated standalone teleprompter pages.
Clicking it displays a modal overlay showing a QR code that encodes the current
page URL, so the operator can share the page with a reader (e.g. actor on phone).

## Scope

- Add a QR button to the `.ui` control bar in the `generateStandalone()` template
  inside `script.js`
- Clicking QR renders a centered modal with a QR code image from
  `api.qrserver.com` using `window.location.href`
- Clicking outside the modal or pressing Escape dismisses it
- Only newly generated files get the button; existing files are unaffected

## Out of Scope

- QR codes on the homepage listing (`index.html`)
- Offline QR generation (the page already requires internet for Google Fonts)
- Modifying any existing generated teleprompter HTML files

## Approach

The QR image is a plain `<img>` tag pointing at the free `api.qrserver.com`
API — no JS library, no build step. The modal is a fixed overlay injected into
the standalone template, toggled via a small inline script.
