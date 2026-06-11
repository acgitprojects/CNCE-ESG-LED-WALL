import './previewer.css';
import cncbiOriginal from './assets/cncbi-dashboard-original.png';

// Set the 16:9 original-export image from a Vite-hashed, base-aware URL so it
// resolves correctly on GitHub Pages (project-page base path).
const wallimg = document.getElementById('wallimg');
if (wallimg) wallimg.src = cncbiOriginal;

const scene    = document.getElementById('scene');
const rail     = document.getElementById('rail');
const fill     = document.getElementById('railfill');
const fitSeg   = document.getElementById('fitSeg');
const lightSeg = document.getElementById('lightSeg');
const readout  = document.getElementById('readout');

const VIEWS = ['back', 'mid', 'front', 'close'];
const VIEWMETA = {
  back:  { n: 'Back of hall' },
  mid:   { n: 'Mid-house' },
  front: { n: 'Front row' },
  close: { n: 'Close-up' },
};
const FIT = {
  full: {
    n: 'Full-width',
    res: '5760 × 1512 px',
    note: 'a dashboard authored to the full 9 m wall — reaches every edge, nothing wasted',
  },
  '169': {
    n: '16 : 9 (original)',
    res: '1960 × 1120 px',
    note: 'the original CNCBI export, centred at full height — only ~47% of the wall lights up, the side panels stay dark',
  },
};

const state = { view: 'back', fit: 'full', light: 'day' };
try {
  const s = JSON.parse(localStorage.getItem('townhallPrev') || '{}');
  if (s.view && VIEWMETA[s.view]) state.view = s.view;
  if (s.fit  && FIT[s.fit])       state.fit  = s.fit;
  if (s.light === 'day' || s.light === 'night') state.light = s.light;
} catch {}

function persist() {
  try { localStorage.setItem('townhallPrev', JSON.stringify(state)); } catch {}
}

function render() {
  document.documentElement.dataset.light = state.light;
  scene.dataset.view  = state.view;
  scene.dataset.fit   = state.fit;
  scene.dataset.light = state.light;

  rail.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', b.dataset.view === state.view);
  });
  const idx = VIEWS.indexOf(state.view);
  fill.style.height = (idx / (VIEWS.length - 1) * 100) + '%';

  fitSeg.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', b.dataset.fit === state.fit);
  });
  lightSeg.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', b.dataset.light === state.light);
  });

  const f = FIT[state.fit];
  readout.innerHTML =
    '<b>' + VIEWMETA[state.view].n + '</b> · ' +
    '<b>' + f.n + '</b> (' + f.res + ') — ' + f.note + '.';

  persist();
}

rail.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) { state.view = b.dataset.view; render(); }
});
fitSeg.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) { state.fit = b.dataset.fit; render(); }
});
lightSeg.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) { state.light = b.dataset.light; render(); }
});

document.addEventListener('keydown', (e) => {
  const i = VIEWS.indexOf(state.view);
  if (e.key >= '1' && e.key <= '4') {
    state.view = VIEWS[+e.key - 1]; render();
  } else if (e.key === 'ArrowUp') {
    state.view = VIEWS[Math.min(i + 1, 3)]; render();
  } else if (e.key === 'ArrowDown') {
    state.view = VIEWS[Math.max(i - 1, 0)]; render();
  } else if (e.key === 'a' || e.key === 'A') {
    state.fit = state.fit === 'full' ? '169' : 'full'; render();
  } else if (e.key === 'l' || e.key === 'L') {
    state.light = state.light === 'day' ? 'night' : 'day'; render();
  }
});

// First paint with no transition so a throttled tab can't freeze mid-dolly
scene.classList.add('no-anim');
render();
requestAnimationFrame(() => requestAnimationFrame(() => scene.classList.remove('no-anim')));
