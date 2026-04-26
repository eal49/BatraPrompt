# Design: QR Code Button

## UI Layout

Control bar (bottom-left of generated page):
```
[Start] [Pause] [Reset] [QR]
```

Modal (centered, appears on QR click):
```
┌─────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░                        ░  │
│  ░   [QR code image]      ░  │
│  ░                        ░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░  │
│  https://eal49.github.io/…  │
└─────────────────────────────┘
     dark backdrop, click to close
```

## QR Image URL

```
https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=<encodedURL>
```

Built at click time: `encodeURIComponent(window.location.href)`

## HTML Added to Template

```html
<!-- in .ui bar -->
<button class="btn" id="qrbtn">QR</button>

<!-- modal overlay, hidden by default -->
<div id="qrmodal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,.8);
     z-index:100; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:12px;">
  <img id="qrimg" width="220" height="220" style="border-radius:8px; background:#fff; padding:8px;" />
  <span style="color:#a8acb8; font-size:12px; max-width:300px; text-align:center; word-break:break-all;" id="qrurl"></span>
</div>
```

## JS Added to Template

```js
const qrbtn = document.getElementById('qrbtn');
const qrmodal = document.getElementById('qrmodal');
const qrimg = document.getElementById('qrimg');
const qrurl = document.getElementById('qrurl');

qrbtn.addEventListener('click', function() {
  const url = window.location.href;
  qrimg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(url);
  qrurl.textContent = url;
  qrmodal.style.display = 'flex';
});
qrmodal.addEventListener('click', function(e) {
  if (e.target === qrmodal) qrmodal.style.display = 'none';
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') qrmodal.style.display = 'none';
});
```

## Integration Point

All changes are inside the template string in `generateStandalone()` in
`script.js`. The modal starts hidden (`display:none` overridden to `flex` on
open). The QR image `src` is set lazily at click time to avoid an unnecessary
network request on page load.
