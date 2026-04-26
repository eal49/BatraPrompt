// Teleprompter logic
(function() {
    const textarea = document.getElementById('inputText');
    const speedNumber = document.getElementById('speedInput'); // words/sec
    const speedRange = document.getElementById('speedRange');  // words/sec
    const fontSizeNumber = document.getElementById('fontSizeInput');
    const fontSizeRange = document.getElementById('fontSizeRange');
    const fadeEdgesToggle = document.getElementById('fadeEdgesToggle');

    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const generateBtn = document.getElementById('generateBtn');

    const stage = document.getElementById('stageContainer');
    const prompt = document.getElementById('prompt');
    const promptContent = document.getElementById('promptContent');
    const maskTop = document.getElementById('stageMaskTop');
    const maskBottom = document.getElementById('stageMaskBottom');

    // State
    let state = {
        isRunning: false,
        isPaused: false,
        speedWordsPerSec: 3,
        offsetY: 0, // current translateY in px (negative goes up)
        rafId: 0,
        lastTs: 0
    };

    // Helpers
    function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
    function setButtons({ started }) {
        startBtn.disabled = started;
        pauseBtn.disabled = !started;
        resetBtn.disabled = !started;
        pauseBtn.textContent = state.isPaused ? 'Resume' : 'Pause';
    }
    function applyOffset() {
        // Translate the content, not the container, to ensure movement is visible
        promptContent.style.transform = `translateY(${-state.offsetY}px)`;
    }
    function stageScrollableHeight() {
        // Compute total content height including vertical padding of .prompt (48 top + 48 bottom)
        const promptStyles = getComputedStyle(prompt);
        const paddingTop = parseFloat(promptStyles.paddingTop) || 0;
        const paddingBottom = parseFloat(promptStyles.paddingBottom) || 0;
        const contentHeight = promptContent.offsetHeight + paddingTop + paddingBottom;
        const viewportHeight = stage.clientHeight;
        return Math.max(0, contentHeight - viewportHeight);
    }

    // Convert words/sec to px/sec using a dynamic pixels-per-word estimate
    function countWords(text) {
        const m = (text || '').trim().match(/\S+/g);
        return m ? m.length : 0;
    }
    function pixelsPerWord() {
        const words = countWords(promptContent.textContent);
        const height = promptContent.offsetHeight;
        if (!words || !height) return 10; // conservative fallback
        return Math.max(1, height / words);
    }

    function start() {
        if (state.isRunning) return;
        const text = textarea.value.trim();
        if (!text) {
            // Load a helpful sample text to demonstrate
            textarea.value = 'Welcome to the Teleprompter.\n\nPaste your script here, set the speed, and press Start.\n\nUse Pause/Resume to control pacing. Good luck!';
        }
        promptContent.textContent = textarea.value || '';
        // Reset any previous transform in case of restarts and size changes
        promptContent.style.transform = 'translateY(0px)';
        state.isRunning = true;
        state.isPaused = false;
        state.offsetY = 0;
        state.lastTs = 0;
        applyOffset();
        setButtons({ started: true });
        state.rafId = requestAnimationFrame(loop);
    }

    function pauseOrResume() {
        if (!state.isRunning) return;
        state.isPaused = !state.isPaused;
        if (!state.isPaused) {
            state.lastTs = 0; // reset delta measurement
            state.rafId = requestAnimationFrame(loop);
        } else if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = 0;
        }
        setButtons({ started: true });
    }

    function reset() {
        state.isRunning = false;
        state.isPaused = false;
        state.offsetY = 0;
        state.lastTs = 0;
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.rafId = 0;
        applyOffset();
        setButtons({ started: false });
    }

    function loop(ts) {
        if (!state.isRunning || state.isPaused) return;
        if (state.lastTs === 0) {
            // prime timestamp, skip movement this frame
            state.lastTs = ts;
            state.rafId = requestAnimationFrame(loop);
            return;
        }
        const dtMs = ts - state.lastTs;
        state.lastTs = ts;
        const dtSec = dtMs / 1000;
        const distance = state.speedWordsPerSec * pixelsPerWord() * dtSec;
        const maxOffset = stageScrollableHeight();
        state.offsetY = clamp(state.offsetY + distance, 0, maxOffset);
        applyOffset();
        if (state.offsetY >= maxOffset) {
            // Reached the end
            state.isRunning = false;
            setButtons({ started: false });
            return;
        }
        state.rafId = requestAnimationFrame(loop);
    }

    // Bindings: speed
    function updateSpeedFrom(value) {
        const v = clamp(Number(value) || 0, Number(speedNumber.min), Number(speedNumber.max));
        speedNumber.value = String(v);
        speedRange.value = String(v);
        state.speedWordsPerSec = v;
    }
    speedNumber.addEventListener('input', (e) => updateSpeedFrom(e.target.value));
    speedRange.addEventListener('input', (e) => updateSpeedFrom(e.target.value));

    // Bindings: font size
    function updateFontSizeFrom(value) {
        const v = clamp(Number(value) || 0, Number(fontSizeNumber.min), Number(fontSizeNumber.max));
        fontSizeNumber.value = String(v);
        fontSizeRange.value = String(v);
        promptContent.style.fontSize = v + 'px';
    }
    fontSizeNumber.addEventListener('input', (e) => updateFontSizeFrom(e.target.value));
    fontSizeRange.addEventListener('input', (e) => updateFontSizeFrom(e.target.value));
    // Initialize font size
    updateFontSizeFrom(fontSizeNumber.value);

    // Mirror toggle removed

    // Fade masks
    function applyMaskVisibility() {
        const hide = !fadeEdgesToggle.checked;
        maskTop.classList.toggle('is-hidden', hide);
        maskBottom.classList.toggle('is-hidden', hide);
    }
    fadeEdgesToggle.addEventListener('change', applyMaskVisibility);
    applyMaskVisibility();

    // Controls
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pauseOrResume);
    resetBtn.addEventListener('click', reset);
    generateBtn.addEventListener('click', generateStandalone);

    // Keyboard controls: Space = pause/resume, R = reset
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!state.isRunning) start(); else pauseOrResume();
        } else if (e.key.toLowerCase() === 'r') {
            reset();
        }
    });

    // Standalone read-only generator
    function escapeHtml(text) {
        return (text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    function generateStandalone() {
        const text = textarea.value || '';
        const wordsPerSec = Number(speedNumber.value) || 3;
        const fontSizePx = Number(fontSizeNumber.value) || 28;
        const fadeEnabled = !!fadeEdgesToggle.checked;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Teleprompter</title>
  <meta name="color-scheme" content="light dark" />
  <style>
    :root{--bg:#0b0b0c;--panel:#141416;--text:#eaeaf0;--muted:#a8acb8;--border:#23242a}
    *{box-sizing:border-box}html,body{height:100%}body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;color:var(--text);background:var(--bg)}
    .stage{position:fixed;inset:0;background:var(--panel)}
    .viewport{position:absolute;inset:0;overflow:hidden}
    .mask{position:absolute;left:0;right:0;height:18%;pointer-events:none;z-index:2;opacity:${fadeEnabled ? '1' : '0'};transition:opacity .2s}
    .mask.top{top:0;background:linear-gradient(180deg,rgba(11,11,12,.95),rgba(11,11,12,0))}
    .mask.bottom{bottom:0;background:linear-gradient(0deg,rgba(11,11,12,.95),rgba(11,11,12,0))}
    .prompt{position:absolute;inset:0;padding:48px 24px;display:flex;justify-content:center;align-items:flex-start}
    .content{max-width:900px;line-height:1.6;font-size:${fontSizePx}px;white-space:pre-wrap;will-change:transform}
    .ui{position:fixed;left:12px;bottom:12px;color:var(--muted);font-size:12px}
    .btn{appearance:none;border:1px solid var(--border);background:#1a1b1f;color:var(--text);border-radius:8px;padding:8px 10px;cursor:pointer;margin-right:6px}
  </style>
</head>
<body>
  <div class="stage">
    <div class="viewport" id="v">
      <div class="mask top"></div>
      <div class="mask bottom"></div>
      <div class="prompt"><div class="content" id="c">${escapeHtml(text)}</div></div>
    </div>
  </div>
  <div class="ui">
    <button class="btn" id="start">Start</button>
    <button class="btn" id="pause">Pause</button>
    <button class="btn" id="reset">Reset</button>
    <button class="btn" id="qrbtn">QR</button>
  </div>
  <div id="qrmodal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:100;align-items:center;justify-content:center;flex-direction:column;gap:12px">
    <img id="qrimg" width="220" height="220" style="border-radius:8px;background:#fff;padding:8px" alt="QR code" />
    <span id="qrurl" style="color:#a8acb8;font-size:11px;max-width:300px;text-align:center;word-break:break-all"></span>
  </div>
  <script>
  (function(){
    const v=document.getElementById('v');
    const c=document.getElementById('c');
    const start=document.getElementById('start');
    const pause=document.getElementById('pause');
    const reset=document.getElementById('reset');
    const state={running:false,paused:false,offset:0,ts:0,raf:0,wordsPerSec:${wordsPerSec}};
    function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
    function h(){const s=getComputedStyle(c.parentElement);return Math.max(0,(c.offsetHeight+parseFloat(s.paddingTop)+parseFloat(s.paddingBottom))-v.clientHeight)}
    function wc(t){t=(t||'').trim();return t? (t.match(/\\S+/g)||[]).length:0}
    function ppw(){const w=wc(c.textContent);const ht=c.offsetHeight;return (!w||!ht)?10:Math.max(1,ht/w)}
    function apply(){c.style.transform='translateY('+-state.offset+'px)'}
    function loop(ts){if(!state.running||state.paused) return; if(state.ts===0){state.ts=ts;state.raf=requestAnimationFrame(loop);return;} const dt=(ts-state.ts)/1000; state.ts=ts; state.offset=clamp(state.offset+state.wordsPerSec*ppw()*dt,0,h()); apply(); if(state.offset>=h()){state.running=false;return;} state.raf=requestAnimationFrame(loop)}
    function startRun(){if(state.running) return; state.running=true; state.paused=false; state.offset=0; state.ts=0; apply(); state.raf=requestAnimationFrame(loop)}
    function pauseResume(){ if(!state.running) return; state.paused=!state.paused; if(!state.paused){state.ts=0; state.raf=requestAnimationFrame(loop)} else {cancelAnimationFrame(state.raf); state.raf=0} }
    function resetRun(){ state.running=false; state.paused=false; state.offset=0; state.ts=0; cancelAnimationFrame(state.raf); state.raf=0; apply() }
    start.addEventListener('click',startRun); pause.addEventListener('click',pauseResume); reset.addEventListener('click',resetRun);
    window.addEventListener('keydown',e=>{ if(e.code==='Space'){ e.preventDefault(); if(!state.running) startRun(); else pauseResume(); } else if((e.key||'').toLowerCase()==='r'){ resetRun(); } else if(e.key==='Escape'){ qrmodal.style.display='none'; } });
    const qrbtn=document.getElementById('qrbtn');
    const qrmodal=document.getElementById('qrmodal');
    const qrimg=document.getElementById('qrimg');
    const qrurl=document.getElementById('qrurl');
    qrbtn.addEventListener('click',function(){ const u=window.location.href; qrimg.src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data='+encodeURIComponent(u); qrurl.textContent=u; qrmodal.style.display='flex'; });
    qrmodal.addEventListener('click',function(e){ if(e.target===qrmodal) qrmodal.style.display='none'; });
  })();
  </script>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        const id = new Date().toISOString().replace(/[:.]/g,'-');
        a.download = `teleprompter-${id}.html`;
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
    }
})();


