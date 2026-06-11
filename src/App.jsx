import React from 'react';
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSlider,
  TweakToggle, TweakSelect, TweakColor, TweakButton,
} from './TweaksPanel.jsx';
import { replay, setMode, gotoFloor, setRotateMs, fit } from './dashboard.js';

const EMBED_PARAMS  = new URLSearchParams(location.search);
const FORCED_DIM    = EMBED_PARAMS.get('dim');
const IS_EMBED      = EMBED_PARAMS.has('embed');
const FORCED_FLOOR  = EMBED_PARAMS.get('floor');
const FORCED_ROTATE = EMBED_PARAMS.has('rotate');

const TWEAK_DEFAULTS = {
  lang:       'zh',
  brand:      ['#F26F21', '#E0530E', '#FF7A2E', '#FFF1E7'],
  accent:     '#6D4FE0',
  cards:      'soft',
  radius:     28,
  typeScale:  100,
  density:    'comfortable',
  heroPos:    'left',
  tint:       'white',
  motion:     true,
  dim:        'wide',
  floorMode:  'single',
  floor:      '0',
  rotateSec:  6,
};

const BRANDS = [
  ['#F26F21', '#E0530E', '#FF7A2E', '#FFF1E7'],
  ['#F5821F', '#E2620A', '#FF9036', '#FFF2E3'],
  ['#F4562A', '#DB3D12', '#FF7044', '#FFEDE6'],
  ['#EC6515', '#D14E07', '#FA7E2E', '#FFF0E5'],
];
const TINTS = {
  white: ['#F3F3F5', '#FFFFFF'],
  warm:  ['#F6F1EC', '#FFFDFB'],
  cool:  ['#EEF1F5', '#FFFFFF'],
};

function applyTweaks(t) {
  const st = document.getElementById('stage');
  if (!st) return;
  const set = (k, v) => st.style.setProperty(k, v);

  st.classList.remove('lang-zh', 'lang-en', 'lang-bi');
  st.classList.add('lang-' + t.lang);

  const b = t.brand || BRANDS[0];
  set('--orange', b[0]); set('--orange-deep', b[1]);
  set('--orange-bright', b[2]); set('--orange-soft', b[3]);
  set('--violet', t.accent);
  set('--violet-soft', `color-mix(in srgb, ${t.accent} 14%, #fff)`);

  st.classList.remove('cards-soft', 'cards-outline', 'cards-elevated');
  st.classList.add('cards-' + t.cards);

  set('--radius', t.radius + 'px');
  set('--type-scale', (t.typeScale / 100).toFixed(3));

  st.classList.remove('density-comfortable', 'density-compact');
  st.classList.add('density-' + t.density);
  st.classList.remove('hero-left', 'hero-right');
  st.classList.add('hero-' + t.heroPos);

  const tn = TINTS[t.tint] || TINTS.white;
  set('--page-bg', tn[0]); set('--panel-bg', tn[1]); set('--card-bg', tn[1]);

  st.classList.toggle('motion-off', !t.motion);
  st.classList.toggle('dim-169',  t.dim === '169');
  st.classList.toggle('dim-wide', t.dim !== '169');

  fit();
}

export function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const first = React.useRef(true);

  React.useEffect(() => {
    applyTweaks(FORCED_DIM ? { ...t, dim: FORCED_DIM } : t);
  }, [t]);

  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (t.motion) replay();
  }, [t.motion]);

  React.useEffect(() => {
    setRotateMs(t.rotateSec * 1000);
    if (FORCED_ROTATE) { setMode('rotate'); return; }
    if (FORCED_FLOOR != null) { gotoFloor(FORCED_FLOOR === 'all' ? 'all' : +FORCED_FLOOR); return; }
    if (t.floorMode === 'single') gotoFloor(+t.floor);
    else setMode(t.floorMode);
  }, []);

  const FLOOR_OPTS = [
    { value: '0', label: '29/F · Reception' },
    { value: '1', label: '30/F · Trading' },
    { value: '2', label: '31/F · Office' },
    { value: '3', label: '32/F · Executive' },
  ];

  if (IS_EMBED) return null;

  return (
    <TweaksPanel title="Dashboard Tweaks">
      <TweakSection label="Canvas" />
      <TweakRadio label="Dimension" value={t.dim}
        options={[{ value: 'wide', label: 'LED wall 3.81:1' }, { value: '169', label: '16:9' }]}
        onChange={(v) => setTweak('dim', v)} />

      <TweakSection label="Floors · HQ has 4" />
      <TweakRadio label="Floor view" value={t.floorMode}
        options={[{ value: 'single', label: 'Single' }, { value: 'rotate', label: 'Rotate' }, { value: 'combined', label: 'HQ total' }]}
        onChange={(v) => { setTweak('floorMode', v); setMode(v); }} />
      <TweakSelect label="Show floor" value={t.floor} options={FLOOR_OPTS}
        onChange={(v) => { setTweak('floor', v); setTweak('floorMode', 'single'); gotoFloor(+v); }} />
      <TweakSlider label="Rotate every" value={t.rotateSec} min={3} max={15} step={1} unit="s"
        onChange={(v) => { setTweak('rotateSec', v); setRotateMs(v * 1000); }} />

      <TweakSection label="Language" />
      <TweakRadio label="Display" value={t.lang}
        options={[{ value: 'zh', label: '繁中' }, { value: 'en', label: 'EN' }, { value: 'bi', label: '雙語' }]}
        onChange={(v) => setTweak('lang', v)} />

      <TweakSection label="Brand colour" />
      <TweakColor label="Orange family" value={t.brand} options={BRANDS}
        onChange={(v) => setTweak('brand', v)} />
      <TweakColor label="Accent" value={t.accent}
        options={['#6D4FE0', '#5566E8', '#8A6BFF', '#0EA5A0']}
        onChange={(v) => setTweak('accent', v)} />
      <TweakRadio label="Surface" value={t.tint}
        options={[{ value: 'white', label: 'White' }, { value: 'warm', label: 'Warm' }, { value: 'cool', label: 'Cool' }]}
        onChange={(v) => setTweak('tint', v)} />

      <TweakSection label="Cards & shape" />
      <TweakRadio label="Card style" value={t.cards}
        options={[{ value: 'soft', label: 'Soft' }, { value: 'outline', label: 'Outline' }, { value: 'elevated', label: 'Raised' }]}
        onChange={(v) => setTweak('cards', v)} />
      <TweakSlider label="Corner radius" value={t.radius} min={4} max={48} step={2} unit="px"
        onChange={(v) => setTweak('radius', v)} />

      <TweakSection label="Layout" />
      <TweakSlider label="Text scale" value={t.typeScale} min={82} max={122} step={2} unit="%"
        onChange={(v) => setTweak('typeScale', v)} />
      <TweakRadio label="Density" value={t.density}
        options={[{ value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' }]}
        onChange={(v) => setTweak('density', v)} />
      <TweakRadio label="Hero side" value={t.heroPos}
        options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]}
        onChange={(v) => setTweak('heroPos', v)} />

      <TweakSection label="Motion" />
      <TweakToggle label="Ambient motion" value={t.motion}
        onChange={(v) => setTweak('motion', v)} />
      <TweakButton label="▸ Replay animation" onClick={() => replay()} />
    </TweaksPanel>
  );
}
