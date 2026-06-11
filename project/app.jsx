/* ============================================================
   Tweaks panel — meeting controls for the CNCB ESG dashboard
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "lang": "zh",
  "brand": ["#F26F21", "#E0530E", "#FF7A2E", "#FFF1E7"],
  "accent": "#6D4FE0",
  "cards": "soft",
  "radius": 28,
  "typeScale": 100,
  "density": "comfortable",
  "heroPos": "left",
  "tint": "white",
  "motion": true,
  "dim": "wide",
  "floorMode": "single",
  "floor": "0",
  "rotateSec": 6
}/*EDITMODE-END*/;

/* ---- previewer embed params (no persistence; display-only overrides) ----
   index.html?embed         → hide the Tweaks panel (clean wall content)
   index.html?dim=wide|169  → force canvas dimension for this view
   index.html?floor=0..3|all→ force a floor
   index.html?rotate        → auto-rotate floors                            */
const EMBED_PARAMS = new URLSearchParams(location.search);
const FORCED_DIM   = EMBED_PARAMS.get("dim");           // "wide" | "169" | null
const IS_EMBED     = EMBED_PARAMS.has("embed");
const FORCED_FLOOR = EMBED_PARAMS.get("floor");          // "0".."3" | "all" | null
const FORCED_ROTATE= EMBED_PARAMS.has("rotate");

const BRANDS = [
  ["#F26F21", "#E0530E", "#FF7A2E", "#FFF1E7"], // CITIC orange (current)
  ["#F5821F", "#E2620A", "#FF9036", "#FFF2E3"], // warm amber
  ["#F4562A", "#DB3D12", "#FF7044", "#FFEDE6"], // coral-orange
  ["#EC6515", "#D14E07", "#FA7E2E", "#FFF0E5"]  // deep tangerine
];
const TINTS = {
  white: ["#F3F3F5", "#FFFFFF"],
  warm:  ["#F6F1EC", "#FFFDFB"],
  cool:  ["#EEF1F5", "#FFFFFF"]
};

function applyTweaks(t) {
  const st = document.getElementById("stage");
  if (!st) return;
  const set = (k, v) => st.style.setProperty(k, v);

  // language
  st.classList.remove("lang-zh", "lang-en", "lang-bi");
  st.classList.add("lang-" + t.lang);

  // brand orange family
  const b = t.brand || BRANDS[0];
  set("--orange", b[0]); set("--orange-deep", b[1]);
  set("--orange-bright", b[2]); set("--orange-soft", b[3]);

  // secondary accent
  set("--violet", t.accent);
  set("--violet-soft", `color-mix(in srgb, ${t.accent} 14%, #fff)`);

  // card style
  st.classList.remove("cards-soft", "cards-outline", "cards-elevated");
  st.classList.add("cards-" + t.cards);

  // shape + type
  set("--radius", t.radius + "px");
  set("--type-scale", (t.typeScale / 100).toFixed(3));

  // density + hero position
  st.classList.remove("density-comfortable", "density-compact");
  st.classList.add("density-" + t.density);
  st.classList.remove("hero-left", "hero-right");
  st.classList.add("hero-" + t.heroPos);

  // background tint
  const tn = TINTS[t.tint] || TINTS.white;
  set("--page-bg", tn[0]); set("--panel-bg", tn[1]); set("--card-bg", tn[1]);

  // motion
  st.classList.toggle("motion-off", !t.motion);

  // canvas dimension
  st.classList.toggle("dim-169", t.dim === "169");
  st.classList.toggle("dim-wide", t.dim !== "169");

  if (window.CNCB) window.CNCB.fit();
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const first = React.useRef(true);

  React.useEffect(() => {
    applyTweaks(FORCED_DIM ? { ...t, dim: FORCED_DIM } : t);
  }, [t]);
  // when motion is switched back on, re-run the ambient counters/gauge
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (t.motion && window.CNCB) window.CNCB.replay();
  }, [t.motion]);
  // apply floor settings once on mount (kept out of applyTweaks so colour/type
  // changes don't reset an in-progress auto-rotation)
  React.useEffect(() => {
    if (!window.CNCB) return;
    window.CNCB.setRotateMs(t.rotateSec * 1000);
    // previewer overrides win for embedded wall views
    if (FORCED_ROTATE) { window.CNCB.setMode("rotate"); return; }
    if (FORCED_FLOOR != null) { window.CNCB.gotoFloor(FORCED_FLOOR === "all" ? "all" : +FORCED_FLOOR); return; }
    if (t.floorMode === "single") window.CNCB.gotoFloor(+t.floor);
    else window.CNCB.setMode(t.floorMode);
  }, []);

  const FLOOR_OPTS = [
    { value: "0", label: "29/F · Reception" },
    { value: "1", label: "30/F · Trading" },
    { value: "2", label: "31/F · Office" },
    { value: "3", label: "32/F · Executive" },
  ];

  // embedded wall views render the dashboard only — no controls
  if (IS_EMBED) return null;

  return (
    <TweaksPanel title="Dashboard Tweaks">
      <TweakSection label="Canvas" />
      <TweakRadio label="Dimension" value={t.dim}
        options={[{ value: "wide", label: "LED wall 3.81:1" }, { value: "169", label: "16:9" }]}
        onChange={(v) => setTweak("dim", v)} />

      <TweakSection label="Floors · HQ has 4" />
      <TweakRadio label="Floor view" value={t.floorMode}
        options={[{ value: "single", label: "Single" }, { value: "rotate", label: "Rotate" }, { value: "combined", label: "HQ total" }]}
        onChange={(v) => { setTweak("floorMode", v); window.CNCB && window.CNCB.setMode(v); }} />
      <TweakSelect label="Show floor" value={t.floor} options={FLOOR_OPTS}
        onChange={(v) => { setTweak("floor", v); setTweak("floorMode", "single"); window.CNCB && window.CNCB.gotoFloor(+v); }} />
      <TweakSlider label="Rotate every" value={t.rotateSec} min={3} max={15} step={1} unit="s"
        onChange={(v) => { setTweak("rotateSec", v); window.CNCB && window.CNCB.setRotateMs(v * 1000); }} />

      <TweakSection label="Language" />
      <TweakRadio label="Display" value={t.lang}
        options={[{ value: "zh", label: "繁中" }, { value: "en", label: "EN" }, { value: "bi", label: "雙語" }]}
        onChange={(v) => setTweak("lang", v)} />

      <TweakSection label="Brand colour" />
      <TweakColor label="Orange family" value={t.brand} options={BRANDS}
        onChange={(v) => setTweak("brand", v)} />
      <TweakColor label="Accent" value={t.accent}
        options={["#6D4FE0", "#5566E8", "#8A6BFF", "#0EA5A0"]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakRadio label="Surface" value={t.tint}
        options={[{ value: "white", label: "White" }, { value: "warm", label: "Warm" }, { value: "cool", label: "Cool" }]}
        onChange={(v) => setTweak("tint", v)} />

      <TweakSection label="Cards & shape" />
      <TweakRadio label="Card style" value={t.cards}
        options={[{ value: "soft", label: "Soft" }, { value: "outline", label: "Outline" }, { value: "elevated", label: "Raised" }]}
        onChange={(v) => setTweak("cards", v)} />
      <TweakSlider label="Corner radius" value={t.radius} min={4} max={48} step={2} unit="px"
        onChange={(v) => setTweak("radius", v)} />

      <TweakSection label="Layout" />
      <TweakSlider label="Text scale" value={t.typeScale} min={82} max={122} step={2} unit="%"
        onChange={(v) => setTweak("typeScale", v)} />
      <TweakRadio label="Density" value={t.density}
        options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]}
        onChange={(v) => setTweak("density", v)} />
      <TweakRadio label="Hero side" value={t.heroPos}
        options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]}
        onChange={(v) => setTweak("heroPos", v)} />

      <TweakSection label="Motion" />
      <TweakToggle label="Ambient motion" value={t.motion}
        onChange={(v) => setTweak("motion", v)} />
      <TweakButton label="▸ Replay animation" onClick={() => window.CNCB && window.CNCB.replay()} />
    </TweaksPanel>
  );
}

(function mountPanel() {
  const el = document.getElementById("tweaks-root");
  const go = () => ReactDOM.createRoot(el).render(<App />);
  if (window.useTweaks) go();
  else setTimeout(mountPanel, 40);
})();
