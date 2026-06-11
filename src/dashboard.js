'use strict';

import citicLogo from './assets/citic-logo.png';

/* ---------- bilingual helper ---------- */
const t = (zh, en) => `<span class="t-zh">${zh}</span><span class="t-en">${en}</span>`;
const num = (key, to, dec = 0) =>
  `<span class="v" data-key="${key}" data-to="${to}" data-dec="${dec}">${(0).toFixed(dec)}</span>`;

/* ---------- floor model ---------- */
const FLOORS = [
  { zh: '29樓', en: '29/F', tagZh: '接待大堂', tagEn: 'Reception',
    co2: 590, pm: 10, tvoc: 877, gauge: 0.86,
    eSaved: 36.2, eTrees: 0.2, paperKg: 0.0, paperTrees: 0.0,
    week: 4129.5, total: 6989.6 },
  { zh: '30樓', en: '30/F', tagZh: '交易樓層', tagEn: 'Trading Floor',
    co2: 620, pm: 12, tvoc: 540, gauge: 0.70,
    eSaved: 41.5, eTrees: 0.3, paperKg: 1.2, paperTrees: 0.1,
    week: 3680.2, total: 6204.4 },
  { zh: '31樓', en: '31/F', tagZh: '辦公樓層', tagEn: 'Office Floor',
    co2: 705, pm: 18, tvoc: 690, gauge: 0.58,
    eSaved: 28.9, eTrees: 0.15, paperKg: 2.6, paperTrees: 0.2,
    week: 2951.8, total: 5410.9 },
  { zh: '32樓', en: '32/F', tagZh: '行政樓層', tagEn: 'Executive Floor',
    co2: 540, pm: 8, tvoc: 420, gauge: 0.92,
    eSaved: 33.7, eTrees: 0.25, paperKg: 0.4, paperTrees: 0.0,
    week: 5210.6, total: 7890.3 },
];
const avg = (k) => FLOORS.reduce((s, f) => s + f[k], 0) / FLOORS.length;
const sum = (k) => FLOORS.reduce((s, f) => s + f[k], 0);
const COMBINED = {
  zh: '全層匯總', en: 'HQ Total', tagZh: '四層綜合', tagEn: '4 floors combined',
  co2: Math.round(avg('co2')), pm: Math.round(avg('pm')), tvoc: Math.round(avg('tvoc')),
  gauge: avg('gauge'),
  eSaved: +sum('eSaved').toFixed(1), eTrees: +sum('eTrees').toFixed(1),
  paperKg: +sum('paperKg').toFixed(1), paperTrees: +sum('paperTrees').toFixed(1),
  week: +sum('week').toFixed(1), total: +sum('total').toFixed(1), combined: true,
};

const stCo2  = (v) => (v <= 600  ? 3 : v <= 800 ? 2 : 1);
const stPm   = (v) => (v <= 12   ? 3 : v <= 25  ? 2 : 1);
const stTvoc = (v) => (v <= 500  ? 3 : v <= 750 ? 2 : 1);
const rating = (g) => (g >= 0.8 ? ['優秀', 'Excellent'] : g >= 0.55 ? ['良好', 'Good'] : ['普通', 'Average']);

/* ---------- icons ---------- */
const I = {
  co2: `<svg viewBox="0 0 120 120" fill="none">
    <path class="sk-g" d="M34 64a16 16 0 0 1 2-31 22 22 0 0 1 42-4 15 15 0 0 1 6 35H40" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text class="txt" x="60" y="56" font-size="20" text-anchor="middle">CO₂</text>
    <path class="sk-v" d="M40 78v22M40 100l-7-8M40 100l7-8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="sk-v" d="M60 80v22M60 102l-7-8M60 102l7-8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="sk-v" d="M80 78v22M80 100l-7-8M80 100l7-8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  pm: `<svg viewBox="0 0 120 120" fill="none">
    <circle class="sk-g" cx="60" cy="60" r="30" stroke-width="5" stroke-dasharray="6 9" stroke-linecap="round"/>
    <circle class="fl-o" cx="60" cy="60" r="11"/>
    <circle class="fl-v" cx="40" cy="42" r="7"/><circle class="fl-v" cx="84" cy="50" r="6"/>
    <circle class="fl-v" cx="78" cy="82" r="8"/><circle class="fl-v" cx="44" cy="84" r="5"/>
    <circle class="fl-g" cx="92" cy="74" r="4"/><circle class="fl-g" cx="30" cy="64" r="4"/>
  </svg>`,
  tvoc: `<svg viewBox="0 0 120 120" fill="none">
    <path class="sk-g" d="M36 72a15 15 0 0 1 1-29 21 21 0 0 1 40-4 14 14 0 0 1 5 33H40" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text class="txt" x="59" y="60" font-size="16" text-anchor="middle">TVOC</text>
    <circle class="fl-v" cx="40" cy="92" r="7"/><circle class="fl-o" cx="62" cy="98" r="6"/>
    <circle class="fl-v" cx="82" cy="90" r="8"/><circle class="fl-g" cx="52" cy="104" r="4"/>
  </svg>`,
  bolt: `<svg viewBox="0 0 120 120" fill="none">
    <path class="fl-v" d="M66 14 36 66h20l-6 40 34-56H62z"/>
    <path class="sk-o" d="M92 30l8-8M96 54l10-3M30 36l-9-6" stroke-width="5" stroke-linecap="round"/>
  </svg>`,
  paper: `<svg viewBox="0 0 120 120" fill="none">
    <path class="sk-g fl-none" d="M34 18h36l18 18v66H34z" stroke-width="5" stroke-linejoin="round"/>
    <path class="sk-g fl-none" d="M70 18v18h18" stroke-width="5" stroke-linejoin="round"/>
    <path class="sk-v" d="M46 56h28M46 70h28M46 84h18" stroke-width="5" stroke-linecap="round"/>
    <path class="sk-o" d="M44 44l5 5 9-10" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  badge: `<svg viewBox="0 0 120 120" fill="none">
    <rect class="sk-g fl-none" x="20" y="30" width="46" height="40" rx="5" stroke-width="5"/>
    <path class="sk-g" d="M30 70v16h26V70M20 50h46" stroke-width="5" stroke-linecap="round"/>
    <circle class="fl-w sk-o" cx="84" cy="76" r="26" stroke-width="5"/>
    <path class="fl-o" d="M84 64c-8 2-12 9-9 17 7-1 12-7 9-17z"/>
    <path class="sk-v" d="M84 88c0-8 2-14 6-18" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  leaf: `<svg viewBox="0 0 100 100" fill="none">
    <path d="M82 18C44 18 22 40 22 74c0 4 .4 8 1 12 34 2 59-20 59-58 0-4-.4-7 0-10z" fill="#fff"/>
    <path d="M28 84C40 58 58 40 78 28" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>
  </svg>`,
  check: `<svg viewBox="0 0 40 40" fill="none"><path class="sk-o" d="M9 21l7 7 15-17" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const starSvg = (on) => on
  ? `<svg viewBox="0 0 32 32"><path class="fl-v" d="M16 3l4 8 9 1-6.5 6 1.5 9-8-4.3L8 27l1.5-9L3 12l9-1z"/></svg>`
  : `<svg viewBox="0 0 32 32"><path class="fl-none" stroke="#C9C5E6" stroke-width="2.4" d="M16 4.5l3.6 7.3 8.1.9-5.9 5.5 1.4 8L16 28l-7.2 3.1 1.4-8-5.9-5.5 8.1-.9z"/></svg>`;
const stars = (n) => [0, 1, 2].map((i) => `<span class="s">${starSvg(i < n)}</span>`).join('');

const heroIllus = `<svg viewBox="0 0 320 300" fill="none">
  <rect x="42" y="70" width="150" height="118" rx="10" stroke="#9A9AA4" stroke-width="7" fill="#fff"/>
  <path d="M70 188v34h94v-34M30 142h150" stroke="#9A9AA4" stroke-width="7" stroke-linecap="round"/>
  <rect x="70" y="96" width="94" height="56" rx="6" stroke="#9A9AA4" stroke-width="6" fill="none"/>
  <path d="M150 36v30M150 36c-12 0-22 8-22 18 12 0 22-8 22-18z" stroke="#6D4FE0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="232" cy="170" r="66" fill="#fff" stroke="#F26F21" stroke-width="8"/>
  <path d="M232 138c-20 4-30 22-22 42 18-2 30-20 22-42z" fill="#F26F21"/>
  <path d="M232 196c0-20 4-34 14-44" stroke="#6D4FE0" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M232 236l-12 22h24z" fill="#F26F21"/>
  <path d="M212 250l-10 18M252 250l10 18" stroke="#F26F21" stroke-width="7" stroke-linecap="round"/>
</svg>`;

const treeCluster = `<svg viewBox="0 0 320 230" fill="none">
  <circle cx="74" cy="60" r="20" stroke="#6D4FE0" stroke-width="6"/>
  <circle cx="250" cy="56" r="15" stroke="#6D4FE0" stroke-width="6"/>
  <circle cx="210" cy="150" r="13" stroke="#6D4FE0" stroke-width="6"/>
  <path d="M160 36c-34 0-58 26-58 60 0 30 24 52 58 52s58-22 58-52c0-34-24-60-58-60z" stroke="#F26F21" stroke-width="7" fill="none"/>
  <path d="M110 86c-22 0-38 17-38 40 0 20 16 36 38 36" stroke="#F26F21" stroke-width="7" fill="none"/>
  <path d="M210 86c22 0 38 17 38 40 0 20-16 36-38 36" stroke="#F26F21" stroke-width="7" fill="none"/>
  <path d="M160 150v60M110 162v40M210 162v40" stroke="#9A9AA4" stroke-width="7" stroke-linecap="round"/>
</svg>`;

const ARC = Math.PI * 250;

function gaugeTicks() {
  let out = '';
  for (let i = 0; i <= 40; i++) {
    const a = Math.PI - (Math.PI * i) / 40;
    const big = i % 5 === 0;
    const r1 = 256, r2 = big ? 280 : 270;
    const x1 = 300 + r1 * Math.cos(a), y1 = 300 - r1 * Math.sin(a);
    const x2 = 300 + r2 * Math.cos(a), y2 = 300 - r2 * Math.sin(a);
    out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${big ? 'var(--orange)' : '#E6C8B4'}" stroke-width="${big ? 5 : 3}" stroke-linecap="round" opacity="${i > 26 ? 1 : .55}"/>`;
  }
  return out;
}

function gaugeSvg(f) {
  const off = (ARC * (1 - f.gauge)).toFixed(0);
  const deg = (-180 * (1 - f.gauge)).toFixed(1);
  return `<svg viewBox="0 0 600 360">
    <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFB37A"/><stop offset="1" stop-color="var(--orange-deep)"/>
    </linearGradient></defs>
    <path d="M50 300 A250 250 0 0 1 550 300" stroke="#F0E6DE" stroke-width="34" fill="none" stroke-linecap="round"/>
    <path class="gauge-arc-val" d="M50 300 A250 250 0 0 1 550 300" stroke="url(#gg)" stroke-width="34" fill="none" stroke-linecap="round"
          stroke-dasharray="${ARC.toFixed(0)}" stroke-dashoffset="${off}" data-full="${ARC.toFixed(0)}" data-off="${off}"/>
    ${gaugeTicks()}
    <g class="gauge-needle" data-deg="${deg}" style="transform:rotate(${deg}deg)">
      <circle cx="300" cy="300" r="17" fill="var(--orange-deep)"/>
      <path d="M300 288 L300 312 L448 300 Z" fill="var(--orange)"/>
      <circle cx="300" cy="300" r="7.5" fill="#fff"/>
    </g>
  </svg>`;
}

function treeRow() {
  const glyphs = [
    (x, c) => `<g transform="translate(${x},0)"><circle cx="0" cy="44" r="22" stroke="${c}" stroke-width="5" fill="none"/><path d="M0 66v34" stroke="#9A9AA4" stroke-width="5" stroke-linecap="round"/></g>`,
    (x, c) => `<g transform="translate(${x},0)"><path d="M0 16 L20 60 H-20 Z M0 40 L24 92 H-24 Z" stroke="${c}" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M0 92v8" stroke="#9A9AA4" stroke-width="5" stroke-linecap="round"/></g>`,
    (x, c) => `<g transform="translate(${x},0)"><path d="M-22 100a22 22 0 0 1 44 0z" stroke="${c}" stroke-width="5" fill="none"/></g>`,
    (x, c) => `<circle cx="${x}" cy="40" r="9" stroke="${c}" stroke-width="5" fill="none"/>`,
  ];
  let out = '', x = 60, gi = 0;
  const colors = ['var(--orange)', 'var(--violet)'];
  while (x < 3000) {
    out += glyphs[gi % glyphs.length](x, colors[gi % 2]);
    x += gi % 4 === 3 ? 70 : 150; gi++;
  }
  return `<svg viewBox="0 0 3000 110" preserveAspectRatio="xMinYMax meet">
    <line x1="0" y1="105" x2="3000" y2="105" stroke="#D8D8DE" stroke-width="4"/>${out}</svg>`;
}

function shell(f) {
  const r = rating(f.gauge);
  return `
  <div class="frame"><div class="frame-inner">

    <section class="hero" data-screen-label="Hero · Trees Saved">
      <h2>${t('節省資源消耗', 'Resources Saved')}</h2>
      <div class="hero-floor" id="heroFloor">${t(f.zh + ' · ' + f.tagZh, f.en + ' · ' + f.tagEn)}</div>
      <div class="hero-illus">${heroIllus}</div>
      <ul class="hero-list">
        <li>${t('無紙化業務操作', 'Paperless operations')}</li>
        <li>${t('可重用物料', 'Reusable materials')}</li>
        <li>${t('鋁金屬物料', 'Aluminium materials')}</li>
      </ul>
      <div class="hero-saved">
        <div class="lbl">${t('拯救了', 'We have saved')}</div>
        <div class="big">
          <span class="leaf">${I.leaf}</span>
          <span class="num">${num('week', f.week, 1)}</span>
          <span class="unit">${t('棵樹', 'trees')}</span>
        </div>
      </div>
    </section>

    <div class="headbar">
      <div class="floor-tabs">
        <button class="ftab" data-f="all">${t(COMBINED.zh, COMBINED.en)}</button>
        ${FLOORS.map((fl, i) => `<button class="ftab" data-f="${i}">${t(fl.zh, fl.en)}</button>`).join('')}
      </div>
      <div class="logobox"><image-slot id="citic-logo" shape="rect" fit="contain" src="${citicLogo}" placeholder="Drop CITIC logo (PNG)"></image-slot></div>
    </div>

    <section class="panel aq" data-screen-label="Air Quality">
      <div class="ptitle">${t('空氣質素', 'Air Quality')}</div>
      <div class="psub">${t('* 根據 RESET™ 評級指標', '* Per RESET™ rating index')}</div>
      <div class="metrics">
        <div class="metric">
          <span class="micon">${I.co2}</span>
          <div><div class="mlabel">${t('二氧化碳', 'Carbon Dioxide')}</div>
            <div class="mval">${num('co2', f.co2)}<span class="u">ppm</span></div>
            <div class="mnote">${t('(1000ppm 以下屬可接受水平*)', '(≤1000ppm is acceptable*)')}</div></div>
          <span class="stars" data-key="co2">${stars(stCo2(f.co2))}</span>
        </div>
        <div class="metric">
          <span class="micon">${I.pm}</span>
          <div><div class="mlabel">${t('微細懸浮粒子', 'Fine Particulates')}</div>
            <div class="mval">${num('pm', f.pm)}<span class="u">µg/m³</span></div>
            <div class="mnote">${t('(35 µg/m³ 以下屬可接受水平*)', '(≤35 µg/m³ is acceptable*)')}</div></div>
          <span class="stars" data-key="pm">${stars(stPm(f.pm))}</span>
        </div>
        <div class="metric">
          <span class="micon">${I.tvoc}</span>
          <div><div class="mlabel">${t('揮發性有機化合物', 'Total VOC')}</div>
            <div class="mval">${num('tvoc', f.tvoc)}<span class="u">µg/m³</span></div>
            <div class="mnote">${t('(500 µg/m³ 以下屬可接受水平*)', '(≤500 µg/m³ is acceptable*)')}</div></div>
          <span class="stars" data-key="tvoc">${stars(stTvoc(f.tvoc))}</span>
        </div>
      </div>
    </section>

    <section class="panel en" data-screen-label="Energy">
      <div class="ptitle">${t('能源', 'Energy')}</div>
      <div class="gauge-wrap">
        <div class="gauge" id="gaugeBox">${gaugeSvg(f)}
          <div class="gauge-pill" id="gaugePill">${t(r[0], r[1])}</div>
        </div>
        <div class="gauge-ends"><span>${t('普通', 'Average')}</span><span>${t('優秀', 'Excellent')}</span></div>
        <div class="gauge-cap">${t('根據機電工程署商業類別能源消耗指標的本地銀行組別 (C810)', 'Per EMSD commercial energy-use index, local-bank group (C810)')}</div>
      </div>
      <div class="save-card">
        <span class="sicon">${I.bolt}</span>
        <div><div class="stitle">${t('節省能源', 'Energy Saved')}</div>
          <div class="sbody">
            ${t(`本週節省了 <b>${num('esaved', f.eSaved, 1)}Wh/m²</b> 電量，拯救了 <b>${num('etrees', f.eTrees, 1)}</b> 棵樹。`,
                `Saved <b>${num('esaved', f.eSaved, 1)}Wh/m²</b> this week — <b>${num('etrees', f.eTrees, 1)}</b> trees.`)}
          </div></div>
      </div>
    </section>

    <section class="panel res" data-screen-label="Resources">
      <div class="ptitle">${t('資源', 'Resources')}</div>
      <div class="res-illus">${treeCluster}</div>
      <div class="res-cards">
        <div class="res-card">
          <span class="ricon">${I.paper}</span>
          <div><div class="rtitle">${t('節省紙張消耗', 'Paper Saved')}</div>
            <div class="rbody">
              ${t(`配合無紙化業務操作，本週節省用紙達 <b>${num('paperkg', f.paperKg, 1)}千克</b>，拯救了 <b>${num('papertrees', f.paperTrees, 1)}棵樹</b>。`,
                  `Through paperless operations, <b>${num('paperkg', f.paperKg, 1)}kg</b> saved — <b>${num('papertrees', f.paperTrees, 1)}</b> trees.`)}
            </div></div>
        </div>
        <div class="res-card">
          <span class="ricon">${I.badge}</span>
          <div><div class="rtitle">${t('節省資源消耗', 'Resources Saved')}</div>
            <ul class="checklist">
              <li><span class="ck">${I.check}</span>${t('無紙化業務操作', 'Paperless operations')}</li>
              <li><span class="ck">${I.check}</span>${t('可重用物料', 'Reusable materials')}</li>
              <li><span class="ck">${I.check}</span>${t('鋁金屬物料', 'Aluminium materials')}</li>
            </ul></div>
        </div>
      </div>
    </section>

    <section class="band" data-screen-label="Cumulative Trees">
      <div class="band-text">
        <div class="since">${t('由 2023 年 12 月起，', 'Since December 2023,')}</div>
        <div class="line">${t('合共拯救了', 'a total of')}
          <span class="num">${num('total', f.total, 1)}</span>
          <span class="unit">${t('棵樹', 'trees saved')}</span></div>
      </div>
      <div class="band-trees">${treeRow()}</div>
    </section>

  </div></div>`;
}

/* ---------- value updates ---------- */
const stage = () => document.getElementById('stage');

function setNum(key, to, dec) {
  stage().querySelectorAll(`.v[data-key="${key}"]`).forEach((el) => {
    el.dataset.to = to; el.dataset.dec = dec;
  });
}

function applyFloorStatic(f) {
  const st = stage();
  const r = rating(f.gauge);
  st.querySelector('#heroFloor').innerHTML = t(f.zh + ' · ' + f.tagZh, f.en + ' · ' + f.tagEn);
  st.querySelector('#gaugePill').innerHTML = t(r[0], r[1]);
  st.querySelector('.stars[data-key="co2"]').innerHTML  = stars(stCo2(f.co2));
  st.querySelector('.stars[data-key="pm"]').innerHTML   = stars(stPm(f.pm));
  st.querySelector('.stars[data-key="tvoc"]').innerHTML = stars(stTvoc(f.tvoc));
  const off = (ARC * (1 - f.gauge)).toFixed(0);
  const deg = (-180 * (1 - f.gauge)).toFixed(1);
  const arc    = st.querySelector('.gauge-arc-val');
  const needle = st.querySelector('.gauge-needle');
  if (arc)    arc.dataset.off    = off;
  if (needle) needle.dataset.deg = deg;
  setNum('week', f.week, 1); setNum('co2', f.co2, 0); setNum('pm', f.pm, 0);
  setNum('tvoc', f.tvoc, 0); setNum('esaved', f.eSaved, 1); setNum('etrees', f.eTrees, 1);
  setNum('paperkg', f.paperKg, 1); setNum('papertrees', f.paperTrees, 1);
  setNum('total', f.total, 1);
}

function setActiveTab(target) {
  stage().querySelectorAll('.ftab').forEach((b) =>
    b.classList.toggle('active', b.dataset.f === String(target)));
}

/* ---------- motion ---------- */
function primeFinal() {
  const st = stage();
  st.querySelectorAll('.v').forEach((el) => {
    el.textContent = parseFloat(el.dataset.to).toFixed(parseInt(el.dataset.dec, 10) || 0);
  });
  const arc    = st.querySelector('.gauge-arc-val');
  const needle = st.querySelector('.gauge-needle');
  if (arc)    arc.style.strokeDashoffset     = arc.dataset.off;
  if (needle) needle.style.transform         = `rotate(${needle.dataset.deg}deg)`;
}

function runCounters() {
  stage().querySelectorAll('.v').forEach((el) => {
    const to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec, 10) || 0;
    const dur = 1400, ease = (p) => 1 - Math.pow(1 - p, 3);
    let t0 = null;
    function step(now) {
      if (t0 === null) t0 = now;
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = (to * ease(p)).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

function runGauge() {
  const st     = stage();
  const arc    = st.querySelector('.gauge-arc-val');
  const needle = st.querySelector('.gauge-needle');
  if (!arc) return;
  arc.style.transition = 'none';
  arc.style.strokeDashoffset = arc.dataset.full;
  if (needle) { needle.style.transition = 'none'; needle.style.transform = 'rotate(-180deg)'; }
  void arc.getBoundingClientRect();
  requestAnimationFrame(() => {
    arc.style.transition    = ''; arc.style.strokeDashoffset = arc.dataset.off;
    if (needle) { needle.style.transition = ''; needle.style.transform = `rotate(${needle.dataset.deg}deg)`; }
  });
}

function animate() {
  if (stage().classList.contains('motion-off')) { primeFinal(); return; }
  requestAnimationFrame(() => { runCounters(); runGauge(); });
}

/* ---------- floor controller ---------- */
const ctrl = { mode: 'single', floor: 0, rotateMs: 6000, timer: null };

function showFloor(f, target) { applyFloorStatic(f); setActiveTab(target); animate(); }
function stopRotate() { if (ctrl.timer) { clearInterval(ctrl.timer); ctrl.timer = null; } }
function startRotate() {
  stopRotate();
  let i = ctrl.floor;
  const tick = () => { ctrl.floor = i; showFloor(FLOORS[i], i); i = (i + 1) % FLOORS.length; };
  tick();
  ctrl.timer = setInterval(tick, ctrl.rotateMs);
}

export function setMode(m) {
  stopRotate(); ctrl.mode = m;
  if (m === 'combined') showFloor(COMBINED, 'all');
  else if (m === 'rotate') startRotate();
  else showFloor(FLOORS[ctrl.floor], ctrl.floor);
}

export function gotoFloor(target) {
  stopRotate();
  if (target === 'all') { ctrl.mode = 'combined'; showFloor(COMBINED, 'all'); }
  else { ctrl.mode = 'single'; ctrl.floor = +target; showFloor(FLOORS[ctrl.floor], ctrl.floor); }
}

export function setRotateMs(ms) { ctrl.rotateMs = ms; if (ctrl.mode === 'rotate') startRotate(); }
export function replay() { animate(); }

export function fit() {
  const st = stage();
  const w = st.classList.contains('dim-169') ? 2688 : 5760;
  const s = Math.min(window.innerWidth / w, window.innerHeight / 1512);
  st.style.transform = `translate(-50%, -50%) scale(${s})`;
}

export function mount() {
  const st = stage();
  st.innerHTML = shell(FLOORS[0]);
  st.querySelectorAll('.ftab').forEach((b) =>
    b.addEventListener('click', () => gotoFloor(b.dataset.f === 'all' ? 'all' : +b.dataset.f)));
  setActiveTab(0);
  primeFinal();
  fit();
  animate();
}

window.addEventListener('resize', fit);

if (document.readyState !== 'loading') mount();
else document.addEventListener('DOMContentLoaded', mount);
