/* ─── Token Forge — app.js ──────────────────────────────────────────────────
 * Depends on: BORDERS (js/borders.js loaded before this file)
 * ──────────────────────────────────────────────────────────────────────────── */

const SIZE = 512;

// ── State ──────────────────────────────────────────────────────────────────
let portrait   = null;      // HTMLImageElement | null
let borderImg  = null;      // HTMLImageElement | null
let borderInnerR = 200;     // current clip radius (canvas px)
let ox = 0, oy = 0;        // portrait offset from centre
let sx = 1, sy = 1;        // portrait scale
let drag = { active: false, startX: 0, startY: 0, startOx: 0, startOy: 0 };
let brightness  = 100;
let contrast    = 100;
let saturation  = 100;
let flipH       = false;
let rotation    = 0;

// ── DOM refs ───────────────────────────────────────────────────────────────
const canvas     = document.getElementById('preview-canvas');
const ctx        = canvas.getContext('2d');
const noImg      = document.getElementById('no-img');
const exportBtn  = document.getElementById('export-btn');
const borderGrid = document.getElementById('border-grid');
const innerSlider = document.getElementById('s-inner');
const innerVal    = document.getElementById('v-inner');
const showRingCb  = document.getElementById('show-ring');
const safeRing    = document.getElementById('safe-ring');
const sxSlider    = document.getElementById('s-sx');
const sySlider    = document.getElementById('s-sy');
const linkAxes    = document.getElementById('link-axes');

// ── Background canvas ──────────────────────────────────────────────────────
(function initBgCanvas() {
  const bg  = document.getElementById('bg-canvas');
  const bctx = bg.getContext('2d');
  function resize() { bg.width = window.innerWidth; bg.height = window.innerHeight; drawBg(); }
  function drawBg() {
    bctx.clearRect(0, 0, bg.width, bg.height);
    // subtle stone grain
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * bg.width;
      const y = Math.random() * bg.height;
      const r = Math.random() * 1.5;
      const a = Math.random() * 0.025;
      bctx.beginPath();
      bctx.arc(x, y, r, 0, Math.PI * 2);
      bctx.fillStyle = `rgba(200,150,80,${a})`;
      bctx.fill();
    }
  }
  window.addEventListener('resize', resize);
  resize();
})();

// ── Border grid ─────────────────────────────────────────────────────────────
function buildBorderGrid() {
  BORDERS.forEach((b, i) => {
    const el  = document.createElement('div');
    el.className = 'border-opt loading' + (i === 0 ? ' sel' : '');
    el.dataset.id = b.id;

    const img = document.createElement('img');
    img.alt   = b.name;
    // Load thumbnail lazily using native lazy loading
    img.loading = 'lazy';
    img.src   = b.src;
    img.onload  = () => el.classList.remove('loading');
    img.onerror = () => { el.classList.remove('loading'); el.classList.add('error'); };

    const label = document.createElement('span');
    label.className   = 'bname';
    label.textContent = b.name;

    el.appendChild(img);
    el.appendChild(label);

    el.addEventListener('click', () => selectBorder(el, b));
    borderGrid.appendChild(el);

    // Auto-select first border
    if (i === 0) selectBorder(el, b);
  });

  // + Add custom border button
  const addBtn = document.getElementById('add-border-btn');
  addBtn.addEventListener('click', () => document.getElementById('custom-border-input').click());
}

function selectBorder(el, b) {
  document.querySelectorAll('.border-opt').forEach(x => x.classList.remove('sel'));
  el.classList.add('sel');

  // Load full-res border on demand
  const bi = new Image();
  bi.onload = () => {
    borderImg    = bi;
    borderInnerR = b.innerR;
    innerSlider.value = borderInnerR;
    updateRing();
    render();
  };
  bi.onerror = () => console.error('Failed to load border:', b.src);
  bi.src = b.src;
}

// ── Custom border upload ────────────────────────────────────────────────────
document.getElementById('custom-border-input').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const name   = file.name.replace(/\.[^.]+$/, '').slice(0, 14);
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;

    const el  = document.createElement('div');
    el.className = 'border-opt';
    el.dataset.id = 'custom-' + Date.now();

    const img = document.createElement('img');
    img.src   = src;
    img.alt   = name;

    const lbl = document.createElement('span');
    lbl.className   = 'bname';
    lbl.textContent = name;

    el.appendChild(img);
    el.appendChild(lbl);

    const customBorderDef = { id: el.dataset.id, name, src, innerR: 180 };
    el.addEventListener('click', () => selectBorder(el, customBorderDef));
    borderGrid.insertBefore(el, document.getElementById('add-border-btn'));

    // Auto-select the newly added border
    selectBorder(el, customBorderDef);
  };
  reader.readAsDataURL(file);
  this.value = ''; // reset so same file can be re-uploaded
});

// ── Portrait upload ─────────────────────────────────────────────────────────
const dz = document.getElementById('drop-zone');
const fi = document.getElementById('file-input');

dz.addEventListener('click', () => fi.click());
dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('over'); });
dz.addEventListener('dragleave', () => dz.classList.remove('over'));
dz.addEventListener('drop', e => {
  e.preventDefault();
  dz.classList.remove('over');
  loadPortrait(e.dataTransfer.files[0]);
});
fi.addEventListener('change', () => { if (fi.files[0]) loadPortrait(fi.files[0]); });

function loadPortrait(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      portrait = img;
      ox = 0; oy = 0; sx = 1; sy = 1;
      syncSliders();
      render();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  document.getElementById('dz-text').innerHTML =
    `<strong>${file.name}</strong><br><span style="font-size:11px;color:var(--text-dim)">Click to replace</span>`;
}

// ── Sliders ─────────────────────────────────────────────────────────────────
sxSlider.addEventListener('input', function () {
  sx = this.value / 100;
  document.getElementById('v-sx').textContent = this.value + '%';
  if (linkAxes.checked) { sySlider.value = this.value; sy = sx; document.getElementById('v-sy').textContent = this.value + '%'; }
  render();
});

sySlider.addEventListener('input', function () {
  sy = this.value / 100;
  document.getElementById('v-sy').textContent = this.value + '%';
  if (linkAxes.checked) { sxSlider.value = this.value; sx = sy; document.getElementById('v-sx').textContent = this.value + '%'; }
  render();
});

function syncSliders() {
  sxSlider.value = Math.round(sx * 100);
  sySlider.value = Math.round(sy * 100);
  document.getElementById('v-sx').textContent = sxSlider.value + '%';
  document.getElementById('v-sy').textContent = sySlider.value + '%';
}

document.getElementById('reset-btn').addEventListener('click', () => {
  ox = 0; oy = 0; sx = 1; sy = 1;
  syncSliders();
  render();
});

// ── Safe area ring ──────────────────────────────────────────────────────────
function updateRing() {
  const r   = parseInt(innerSlider.value);
  innerVal.textContent = r;
  const pct = (r / 256) * 100;
  safeRing.style.width  = pct + '%';
  safeRing.style.height = pct + '%';
  safeRing.style.display = showRingCb.checked ? 'block' : 'none';
}

innerSlider.addEventListener('input', function () {
  borderInnerR = parseInt(this.value);
  updateRing();
  render();
});

showRingCb.addEventListener('change', updateRing);

// ── Drag ────────────────────────────────────────────────────────────────────
function canvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  const sc   = SIZE / rect.width;
  const cx   = e.touches ? e.touches[0].clientX : e.clientX;
  const cy   = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (cx - rect.left) * sc, y: (cy - rect.top) * sc };
}

canvas.addEventListener('mousedown', e => {
  if (!portrait) return;
  const p = canvasPos(e);
  drag = { active: true, startX: p.x, startY: p.y, startOx: ox, startOy: oy };
  canvas.classList.add('dragging');
});

canvas.addEventListener('touchstart', e => {
  if (!portrait) return;
  const p = canvasPos(e);
  drag = { active: true, startX: p.x, startY: p.y, startOx: ox, startOy: oy };
}, { passive: true });

window.addEventListener('mousemove', e => {
  if (!drag.active) return;
  const p = canvasPos(e);
  ox = drag.startOx + (p.x - drag.startX);
  oy = drag.startOy + (p.y - drag.startY);
  render();
});

window.addEventListener('touchmove', e => {
  if (!drag.active) return;
  if (e.cancelable) e.preventDefault();
  const p = canvasPos(e);
  ox = drag.startOx + (p.x - drag.startX);
  oy = drag.startOy + (p.y - drag.startY);
  render();
}, { passive: false });

window.addEventListener('mouseup',  () => { drag.active = false; canvas.classList.remove('dragging'); });
window.addEventListener('touchend', () => { drag.active = false; });

canvas.addEventListener('wheel', e => {
  if (!portrait) return;
  e.preventDefault();
  const delta = -e.deltaY * 0.001;
  if (linkAxes.checked) {
    sx = Math.max(0.2, Math.min(2.5, sx + delta));
    sy = sx;
  } else {
    sx = Math.max(0.2, Math.min(2.5, sx + delta));
    sy = Math.max(0.2, Math.min(2.5, sy + delta));
  }
  syncSliders();
  render();
}, { passive: false });

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  ctx.clearRect(0, 0, SIZE, SIZE);

  if (!portrait && !borderImg) {
    noImg.style.display  = '';
    canvas.style.display = 'none';
    exportBtn.disabled   = true;
    return;
  }

  noImg.style.display  = 'none';
  canvas.style.display = 'block';

  if (portrait) {
    const r   = (borderInnerR || (SIZE / 2 - 24)) + 20;
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, r, 0, Math.PI * 2);
    ctx.clip();
    const fit = Math.min(SIZE / portrait.width, SIZE / portrait.height);
    const dw  = portrait.width  * fit * sx;
    const dh  = portrait.height * fit * sy;
    ctx.filter = `brightness(${brightness/100}) contrast(${contrast/100}) saturate(${saturation/100})`;
    ctx.translate(SIZE / 2 + ox, SIZE / 2 + oy);
    if (flipH) ctx.scale(-1, 1);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(portrait, -dw / 2, -dh / 2, dw, dh);
    ctx.filter = 'none';
    ctx.restore();
  }

  if (borderImg) ctx.drawImage(borderImg, 0, 0, SIZE, SIZE);

  exportBtn.disabled = !(portrait && borderImg);
}

// ── Image adjustment listeners ───────────────────────────────────────────────
document.getElementById('s-bright').addEventListener('input', function () {
  brightness = parseInt(this.value);
  document.getElementById('v-bright').textContent = this.value;
  render();
});

document.getElementById('s-contrast').addEventListener('input', function () {
  contrast = parseInt(this.value);
  document.getElementById('v-contrast').textContent = this.value;
  render();
});

document.getElementById('s-sat').addEventListener('input', function () {
  saturation = parseInt(this.value);
  document.getElementById('v-sat').textContent = this.value;
  render();
});

document.getElementById('btn-flip').addEventListener('click', () => {
  flipH = !flipH;
  render();
});

document.getElementById('btn-rot').addEventListener('click', () => {
  rotation = (rotation + 90) % 360;
  render();
});

document.getElementById('reset-adj').addEventListener('click', () => {
  brightness = 100; contrast = 100; saturation = 100;
  flipH = false; rotation = 0;
  document.getElementById('s-bright').value        = 100;
  document.getElementById('v-bright').textContent  = '100';
  document.getElementById('s-contrast').value      = 100;
  document.getElementById('v-contrast').textContent = '100';
  document.getElementById('s-sat').value           = 100;
  document.getElementById('v-sat').textContent     = '100';
  render();
});

// ── Export ───────────────────────────────────────────────────────────────────
exportBtn.addEventListener('click', () => {
  const a    = document.createElement('a');
  a.download = 'token.png';
  a.href     = canvas.toDataURL('image/png');
  a.click();
});

// ── Init ─────────────────────────────────────────────────────────────────────
buildBorderGrid();
render();
