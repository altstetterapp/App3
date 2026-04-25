// Rooftop Planner — three redesigned screens in Boum-inspired style
// Clean white, minimal, professional. Mobile-first iPhone.

// ─── Tweak presets ────────────────────────────────────────────
// Three expressive dimensions that reshape the feel, not pixel-push:
//   vibe      — overall visual personality (color + corner language)
//   pose      — how the stacked plant cards sit on screen 2
//   density   — how much breathing room the UI has
const VIBES = {
  gallery: {
    bg: '#ffffff', text: '#111315', textMuted: '#6b7280', textFaint: '#9ca3af',
    border: 'rgba(0,0,0,0.06)', borderStrong: 'rgba(0,0,0,0.12)',
    accent: '#3a7d44', accentSoft: '#e8f1ea',
    water: '#3b82f6', waterSoft: '#eaf2ff',
    warn: '#e0893a', warnSoft: '#fcefe1',
    danger: '#c0392b', chipBg: '#f4f4f2',
    radius: 1, // multiplier
    shadow: '0 20px 45px -15px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)',
  },
  terracotta: {
    bg: '#fbf6ee', text: '#2b1f16', textMuted: '#7b6653', textFaint: '#b8a48f',
    border: 'rgba(90,54,28,0.10)', borderStrong: 'rgba(90,54,28,0.18)',
    accent: '#7a8a4a', accentSoft: '#edeed9',
    water: '#5b7da3', waterSoft: '#e4ecf3',
    warn: '#c05a2a', warnSoft: '#f7e3d4',
    danger: '#a93826', chipBg: '#f1e9dc',
    radius: 1.25,
    shadow: '0 22px 50px -18px rgba(100,60,20,0.28), 0 4px 12px rgba(90,54,28,0.08)',
  },
  nordic: {
    bg: '#f5f5f3', text: '#0a0a0a', textMuted: '#555', textFaint: '#888',
    border: 'rgba(0,0,0,0.14)', borderStrong: 'rgba(0,0,0,0.3)',
    accent: '#0a0a0a', accentSoft: '#e6e6e3',
    water: '#0a0a0a', waterSoft: '#e6e6e3',
    warn: '#0a0a0a', warnSoft: '#e6e6e3',
    danger: '#0a0a0a', chipBg: '#ebeae6',
    radius: 0.35,
    shadow: '0 2px 0 rgba(0,0,0,0.9)',
  },
};

const DENSITY = {
  zen:      { space: 1.35, fontScale: 1.05, cardH: 450, sheetH: 0.62 },
  balanced: { space: 1,    fontScale: 1,    cardH: 420, sheetH: 0.58 },
  packed:   { space: 0.75, fontScale: 0.92, cardH: 380, sheetH: 0.55 },
};

// Stash current tokens on window so nested components can read without prop-drilling
function useVibe(vibeKey, densityKey) {
  const v = VIBES[vibeKey] || VIBES.gallery;
  const d = DENSITY[densityKey] || DENSITY.balanced;
  return React.useMemo(() => ({
    ...v,
    density: d,
    font: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
    fontDisplay: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif',
  }), [vibeKey, densityKey]);
}

// RP is a live reference — the app binds it each render via <VibeProvider>
let RP = VIBES.gallery;
RP.density = DENSITY.balanced;
RP.font = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif';
RP.fontDisplay = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif';

function VibeProvider({ vibe, density, children }) {
  RP = useVibe(vibe, density);
  return children;
}

// ─── Plant imagery (royalty-free Unsplash photos) ─────────────
const PLANT_IMG = {
  rosmarin:  'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=900&q=80&auto=format&fit=crop',
  erdbeere:  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&q=80&auto=format&fit=crop',
  tomate:    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=900&q=80&auto=format&fit=crop',
  basilikum: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=900&q=80&auto=format&fit=crop',
  mangold:   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80&auto=format&fit=crop',
  salbei:    'https://images.unsplash.com/photo-1600831606133-49adc7ad4ab4?w=900&q=80&auto=format&fit=crop',
  minze:     'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=900&q=80&auto=format&fit=crop',
  thymian:   'https://images.unsplash.com/photo-1596547609652-9cf5d8c10d99?w=900&q=80&auto=format&fit=crop',
  chili:     'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=900&q=80&auto=format&fit=crop',
};

// ─── Tiny inline icons (24px stroke) ──────────────────────────
const Ico = {
  drop: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"
            fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  dropFill: (c = '#3b82f6', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" fill={c}/>
    </svg>
  ),
  sun: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
    </svg>
  ),
  plant: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-7"/>
      <path d="M12 14c-3 0-5-2-5-5 0-1 0-3 1-4 3 0 4 2 4 5"/>
      <path d="M12 14c3 0 5-2 5-5 0-1 0-3-1-4-3 0-4 2-4 5"/>
    </svg>
  ),
  cal: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18M8 3v4M16 3v4"/>
    </svg>
  ),
  gear: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
  chev: (dir = 'right', c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transform: dir === 'left' ? 'rotate(180deg)' : 'none' }}>
      <polyline points="9 6 15 12 9 18"/>
    </svg>
  ),
  plus: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  bell: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10 21a2 2 0 0 0 4 0"/>
    </svg>
  ),
  menu: (c = 'currentColor', s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
  ),
  close: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  ),
  leaf: (c = 'currentColor', s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3c-6 0-11 3-13 8-1.5 4 1 8 5 8 5 0 8-5 8-13V3z"/>
      <path d="M13 11c-2 2-4 5-5 9"/>
    </svg>
  ),
  thermo: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4a2 2 0 1 0-4 0v10a4 4 0 1 0 4 0V4z"/>
    </svg>
  ),
  scissors: (c = 'currentColor', s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
    </svg>
  ),
};

// ─── Phone shell ──────────────────────────────────────────────
function Phone({ children, time = '08:18', statusDark = false }) {
  return (
    <div style={{
      width: 390, height: 780, background: RP.bg,
      borderRadius: 44, position: 'relative',
      boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 40px 80px -20px rgba(0,0,0,.2)',
      overflow: 'hidden',
      fontFamily: RP.font, color: RP.text,
    }}>
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        height: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 32px',
        fontFeatureSettings: '"tnum"',
        fontSize: 16, fontWeight: 600,
        color: statusDark ? '#fff' : '#000',
        paddingTop: 18,
      }}>
        <div>{time}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="18" height="11" viewBox="0 0 18 11" fill={statusDark ? '#fff' : '#000'}>
            <rect x="0" y="6" width="3" height="5" rx="0.7"/>
            <rect x="4.5" y="4" width="3" height="7" rx="0.7"/>
            <rect x="9" y="2" width="3" height="9" rx="0.7"/>
            <rect x="13.5" y="0" width="3" height="11" rx="0.7"/>
          </svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill={statusDark ? '#fff' : '#000'}>
            <path d="M8 3C10 3 12 4 13 5l1-1C13 3 11 2 8 2S3 3 2 4l1 1c1-1 3-2 5-2z"/>
            <path d="M8 6c1 0 2 .5 3 1l1-1c-1-1-2-1.5-4-1.5S4 5 3 6l1 1c1-.5 2-1 4-1z"/>
            <circle cx="8" cy="9.5" r="1.5"/>
          </svg>
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
            <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={statusDark ? '#fff' : '#000'} strokeOpacity="0.4"/>
            <rect x="2" y="2" width="19" height="8" rx="1.5" fill={statusDark ? '#fff' : '#000'}/>
            <path d="M24 4v4c.6-.2 1-.8 1-2s-.4-1.8-1-2z" fill={statusDark ? '#fff' : '#000'} opacity="0.5"/>
          </svg>
        </div>
      </div>
      {/* content */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3,
        background: statusDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.35)',
        zIndex: 60,
      }} />
    </div>
  );
}

// ─── Shared tab bar ───────────────────────────────────────────
function TabBar({ active = 'garten' }) {
  const tabs = [
    { id: 'garten',   label: 'Garten',       icon: Ico.plant },
    { id: 'kalender', label: 'Kalender',     icon: Ico.cal },
    { id: 'giessen',  label: 'Giessen',      icon: Ico.drop },
    { id: 'settings', label: 'Einstellungen',icon: Ico.gear },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 26, paddingTop: 10,
      background: '#fff',
      borderTop: `1px solid ${RP.border}`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 40,
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        const c = on ? RP.text : RP.textFaint;
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 4, minWidth: 60,
          }}>
            {t.icon(c, 22)}
            <div style={{ fontSize: 10.5, color: c, fontWeight: on ? 600 : 500, letterSpacing: 0.1 }}>
              {t.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Weather strip ────────────────────────────────────────────
function WeatherStrip() {
  const days = [
    { d: 'So', n: '19.4', t: '19°', r: '11h' },
    { d: 'Mo', n: '20.4', t: '17°', r: '13h' },
    { d: 'Di', n: '21.4', t: '16°', r: '13h' },
    { d: 'Mi', n: '22.4', t: '17°', r: '13h' },
    { d: 'Do', n: '23.4', t: '20°', r: '13h' },
    { d: 'HE', n: '24.4', t: '22°', r: '13h', today: true },
    { d: 'Sa', n: '25.4', t: '22°', r: '13h' },
    { d: 'So', n: '26.4', t: '20°', r: '13h' },
  ];
  return (
    <div style={{ padding: '0 4px', display: 'flex', gap: 6, overflowX: 'auto' }}>
      {days.map((x, i) => (
        <div key={i} style={{
          minWidth: 44, flex: '0 0 auto',
          padding: '7px 0 8px',
          borderRadius: 14,
          border: `1px solid ${x.today ? RP.text : RP.border}`,
          background: x.today ? RP.text : '#fff',
          color: x.today ? '#fff' : RP.text,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 2,
          fontFeatureSettings: '"tnum"',
        }}>
          <div style={{ fontSize: 9.5, opacity: 0.6, fontWeight: 500, letterSpacing: 0.2 }}>
            {x.today ? 'HEUTE' : x.d}
          </div>
          <div style={{ fontSize: 9, opacity: 0.5 }}>{x.n}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{x.t}</div>
          <div style={{ fontSize: 9, opacity: x.today ? 0.7 : 0.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: x.today ? '#fbbf24' : '#f59e0b', display: 'inline-block' }} />
            {x.r}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SCREEN 1 — Main screen (container list)
// ═════════════════════════════════════════════════════════════
function Screen1() {
  const containers = [
    {
      name: 'Rosmarin-Topf',
      plants: '1 Pflanze · Rosmarin',
      img: PLANT_IMG.rosmarin,
      water: { status: 'ok', label: 'Gegossen vor 2 Std.' },
    },
    {
      name: 'Beeren-Kiste',
      plants: '2 Pflanzen · Erdbeere, Mangold',
      img: PLANT_IMG.erdbeere,
      water: { status: 'warn', label: 'Heute giessen' },
    },
    {
      name: 'Kräuter-Box',
      plants: '3 Pflanzen · Basilikum, Salbei, Thymian',
      img: PLANT_IMG.basilikum,
      water: { status: 'ok', label: 'Gegossen gestern' },
    },
    {
      name: 'Tomaten-Kübel',
      plants: '1 Pflanze · Cherry-Tomate',
      img: PLANT_IMG.tomate,
      water: { status: 'due', label: 'Seit 2 Tagen trocken' },
    },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* top header above status bar area */}
      <div style={{ height: 54 }} />
      {/* header bar */}
      <div style={{
        padding: '6px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button style={{ background: 'none', border: 'none', padding: 6, marginLeft: -6, color: RP.text }}>
          {Ico.menu(RP.text, 22)}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: RP.textMuted, fontWeight: 500 }}>
          <span style={{ fontSize: 15 }}>☀︎</span>
          <span>22°C · Zürich</span>
        </div>
        <div style={{ position: 'relative' }}>
          {Ico.bell(RP.text, 22)}
          <div style={{
            position: 'absolute', top: -3, right: -3,
            width: 16, height: 16, borderRadius: 8,
            background: RP.danger, color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>2</div>
        </div>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* weather */}
        <div style={{ padding: '4px 16px 18px' }}>
          <WeatherStrip />
        </div>

        {/* title */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{
            fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
            fontFamily: RP.fontDisplay, lineHeight: 1.1,
          }}>
            Dein Dachgarten
          </div>
          <div style={{
            marginTop: 8, display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: RP.textMuted,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 4, background: RP.accent,
              boxShadow: `0 0 0 3px ${RP.accentSoft}`,
            }} />
            <span>1 Topf braucht Wasser · 3 in Ordnung</span>
          </div>
        </div>

        {/* stat row */}
        <div style={{ padding: '0 16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { n: 4, l: 'Töpfe' },
            { n: 7, l: 'Pflanzen' },
            { n: 12, l: 'L Wasser' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '12px 12px',
              border: `1px solid ${RP.border}`,
              borderRadius: 14 * RP.radius,
              background: RP.bg,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, fontFamily: RP.fontDisplay }}>{s.n}</div>
              <div style={{ fontSize: 11, color: RP.textMuted, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* section header */}
        <div style={{
          padding: '4px 20px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: RP.textMuted }}>
            CONTAINER
          </div>
          <div style={{ fontSize: 12, color: RP.textMuted, fontWeight: 500 }}>
            Alle anzeigen
          </div>
        </div>

        {/* container cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {containers.map((c, i) => (
            <ContainerCard key={i} c={c} />
          ))}
        </div>
      </div>

      {/* floating add */}
      <button style={{
        position: 'absolute', bottom: 106, right: 18, zIndex: 45,
        width: 52, height: 52, borderRadius: 26,
        background: RP.text, color: '#fff', border: 'none',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}>
        {Ico.plus('#fff', 24)}
      </button>

      <TabBar active="garten" />
    </div>
  );
}

function ContainerCard({ c }) {
  const waterStyle = {
    ok:   { bg: RP.accentSoft, fg: RP.accent,  dot: RP.accent },
    warn: { bg: RP.warnSoft,   fg: RP.warn,    dot: RP.warn },
    due:  { bg: '#fdecea',     fg: RP.danger,  dot: RP.danger },
  }[c.water.status];

  return (
    <div style={{
      borderRadius: 18 * RP.radius,
      background: RP.bg,
      border: `1px solid ${RP.border}`,
      overflow: 'hidden',
      display: 'flex',
      boxShadow: RP.radius < 0.5 ? 'none' : '0 1px 2px rgba(0,0,0,0.02)',
    }}>
      {/* image */}
      <div style={{
        width: 96, height: 96, flexShrink: 0,
        backgroundImage: `url(${c.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      {/* meta */}
      <div style={{
        flex: 1, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: RP.textMuted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.plants}
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 9px', borderRadius: 999,
          background: waterStyle.bg, color: waterStyle.fg,
          alignSelf: 'flex-start',
          fontSize: 11, fontWeight: 600,
        }}>
          {Ico.dropFill(waterStyle.fg, 11)}
          {c.water.label}
        </div>
      </div>
      {/* chevron */}
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 14, color: RP.textFaint }}>
        {Ico.chev('right', RP.textFaint, 18)}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SCREEN 2 — Container detail (Tinder stacked plant cards)
// ═════════════════════════════════════════════════════════════
function Screen2({ pose = 'stack' }) {
  const plants = [
    { name: 'Rosmarin', sub: 'Rosmarinus officinalis', stage: 'Blüte', img: PLANT_IMG.rosmarin, water: { label: 'In 2 Tagen', status: 'ok' }, days: 24 },
    { name: 'Erdbeere', sub: 'Fragaria × ananassa',    stage: 'Fruchtbildung', img: PLANT_IMG.erdbeere, water: { label: 'Heute giessen', status: 'warn' }, days: 41 },
    { name: 'Mangold',  sub: 'Beta vulgaris',          stage: 'Wachstum', img: PLANT_IMG.mangold,  water: { label: 'Morgen', status: 'ok' }, days: 18 },
  ];
  const [idx, setIdx] = React.useState(1);
  const [dragX, setDragX] = React.useState(0);
  const dragging = React.useRef({ active: false, startX: 0 });

  const onDown = (e) => {
    dragging.current = { active: true, startX: e.clientX || e.touches?.[0]?.clientX };
  };
  const onMove = (e) => {
    if (!dragging.current.active) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    setDragX(x - dragging.current.startX);
  };
  const onUp = () => {
    if (!dragging.current.active) return;
    dragging.current.active = false;
    if (dragX > 80 && idx > 0) setIdx(idx - 1);
    else if (dragX < -80 && idx < plants.length - 1) setIdx(idx + 1);
    setDragX(0);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff' }}
         onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
         onTouchMove={onMove} onTouchEnd={onUp}>
      <div style={{ height: 54 }} />

      {/* nav header */}
      <div style={{
        padding: '6px 16px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${RP.border}`,
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Ico.chev('left', RP.text, 18)}
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Beeren-Kiste</div>
          <div style={{ fontSize: 11, color: RP.textMuted }}>3 Pflanzen · Südseite</div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 18, border: `1px solid ${RP.border}`,
          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="4" viewBox="0 0 18 4"><circle cx="2" cy="2" r="2" fill={RP.text}/><circle cx="9" cy="2" r="2" fill={RP.text}/><circle cx="16" cy="2" r="2" fill={RP.text}/></svg>
        </button>
      </div>

      {/* main region: cards on left, watering sidebar on right */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0, bottom: 84,
        display: 'flex',
      }}>
        {/* left — stacked cards */}
        <div style={{
          flex: 1, position: 'relative', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          padding: '8px 0',
        }}>
          {/* dots + counter above */}
          <div style={{
            position: 'absolute', top: 2, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 6, zIndex: 10,
          }}>
            {plants.map((_, i) => (
              <div key={i} style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === idx ? RP.text : RP.border,
                transition: 'all .2s',
              }} />
            ))}
          </div>

          {/* card stack */}
          <div style={{ position: 'relative', width: 210, height: 420 }}
               onMouseDown={onDown} onTouchStart={onDown}>
            {plants.map((p, i) => {
              const offset = i - idx;
              const maxVisible = pose === 'fan' ? 2 : 1;
              if (Math.abs(offset) > maxVisible) return null;
              const isCurrent = offset === 0;
              let x, rotate, scale, opacity, z;
              if (pose === 'fan') {
                // spread neighbors out with rotation
                x = isCurrent ? dragX : offset * 70;
                rotate = isCurrent ? dragX * 0.05 : offset * 8;
                scale = isCurrent ? 1 : 0.88 - Math.abs(offset) * 0.04;
                opacity = isCurrent ? 1 : 0.75 - Math.abs(offset) * 0.25;
                z = 5 - Math.abs(offset);
              } else if (pose === 'carousel') {
                // 3D depth — neighbors recede
                x = isCurrent ? dragX : offset * 150;
                rotate = isCurrent ? dragX * 0.04 : 0;
                scale = isCurrent ? 1 : 0.78;
                opacity = isCurrent ? 1 : 0.35;
                z = isCurrent ? 3 : 1;
              } else {
                // classic Tinder stack
                x = isCurrent ? dragX : offset * 180;
                rotate = isCurrent ? dragX * 0.05 : 0;
                scale = isCurrent ? 1 : 0.92;
                opacity = isCurrent ? 1 : 0.5;
                z = isCurrent ? 3 : 1;
              }
              return (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  transform: `translateX(${x}px) rotate(${rotate}deg) scale(${scale})`,
                  opacity,
                  zIndex: z,
                  transition: dragging.current.active && isCurrent ? 'none' : 'transform .35s cubic-bezier(.2,.8,.3,1), opacity .3s',
                  cursor: isCurrent ? 'grab' : 'pointer',
                }}>
                  <PlantCard p={p} />
                </div>
              );
            })}
          </div>

          {/* prev / next arrows */}
          <button onClick={() => idx > 0 && setIdx(idx - 1)}
                  disabled={idx === 0}
                  style={arrowBtn('left', idx === 0)}>
            {Ico.chev('left', idx === 0 ? RP.textFaint : RP.text, 18)}
          </button>
          <button onClick={() => idx < plants.length - 1 && setIdx(idx + 1)}
                  disabled={idx === plants.length - 1}
                  style={arrowBtn('right', idx === plants.length - 1)}>
            {Ico.chev('right', idx === plants.length - 1 ? RP.textFaint : RP.text, 18)}
          </button>
        </div>

        {/* right — watering sidebar */}
        <div style={{
          width: 88, borderLeft: `1px solid ${RP.border}`,
          padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, color: RP.textMuted,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {Ico.dropFill(RP.water, 10)} GIESSEN
          </div>
          {plants.map((p, i) => {
            const warn = p.water.status === 'warn';
            return (
              <div key={i} onClick={() => setIdx(i)} style={{
                borderRadius: 12,
                padding: '9px 8px',
                background: i === idx ? RP.chipBg : 'transparent',
                border: `1px solid ${i === idx ? RP.border : 'transparent'}`,
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: RP.text, lineHeight: 1.15 }}>{p.name}</div>
                <div style={{
                  marginTop: 4, fontSize: 9.5, fontWeight: 500,
                  color: warn ? RP.warn : RP.textMuted,
                }}>
                  {p.water.label}
                </div>
                <div style={{
                  marginTop: 8, width: 26, height: 26, borderRadius: 13,
                  background: warn ? RP.warn : RP.waterSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {Ico.dropFill(warn ? '#fff' : RP.water, 13)}
                </div>
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <button style={{
            padding: '10px 6px', borderRadius: 12,
            border: `1px solid ${RP.border}`, background: '#fff',
            fontSize: 10.5, fontWeight: 600, color: RP.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            {Ico.plus(RP.text, 12)} Plan
          </button>
        </div>
      </div>

      <TabBar active="garten" />
    </div>
  );
}

const arrowBtn = (side, disabled) => ({
  position: 'absolute', [side]: 8, top: '50%', transform: 'translateY(-50%)',
  width: 34, height: 34, borderRadius: 17,
  background: '#fff', border: `1px solid ${RP.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  cursor: disabled ? 'default' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  zIndex: 5,
});

function PlantCard({ p }) {
  const warn = p.water.status === 'warn';
  return (
    <div style={{
      width: '100%', height: '100%', borderRadius: 22 * RP.radius,
      background: RP.bg,
      border: `1px solid ${RP.border}`,
      overflow: 'hidden',
      boxShadow: RP.shadow,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: '0 0 62%',
        backgroundImage: `url(${p.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }}>
        {/* stage chip */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 9px', borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(6px)',
          fontSize: 10.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4, color: RP.text,
        }}>
          {Ico.leaf(RP.accent, 10)} {p.stage}
        </div>
        {/* days badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.3 }}>{p.days}</div>
          <div style={{ fontSize: 8, color: RP.textMuted, marginTop: 1 }}>Tage</div>
        </div>
      </div>
      <div style={{
        flex: 1, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, fontFamily: RP.fontDisplay }}>
            {p.name}
          </div>
          <div style={{ fontSize: 11, color: RP.textMuted, fontStyle: 'italic', marginTop: 1 }}>
            {p.sub}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 10,
          background: warn ? RP.warnSoft : RP.waterSoft,
          color: warn ? RP.warn : RP.water,
          fontSize: 11, fontWeight: 600,
          alignSelf: 'flex-start',
        }}>
          {Ico.dropFill(warn ? RP.warn : RP.water, 11)}
          {warn ? 'Giessen fällig' : p.water.label}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SCREEN 3 — Plant profile bottom sheet
// ═════════════════════════════════════════════════════════════
function Screen3({ pose = 'stack' }) {
  // background = screen 2 dimmed; sheet slides up 50%
  const plants = [
    { name: 'Rosmarin', sub: 'Rosmarinus officinalis', stage: 'Blüte', img: PLANT_IMG.rosmarin, water: { label: 'In 2 Tagen', status: 'ok' }, days: 24 },
    { name: 'Erdbeere', sub: 'Fragaria × ananassa',    stage: 'Fruchtbildung', img: PLANT_IMG.erdbeere, water: { label: 'Heute giessen', status: 'warn' }, days: 41 },
    { name: 'Mangold',  sub: 'Beta vulgaris',          stage: 'Wachstum', img: PLANT_IMG.mangold,  water: { label: 'Morgen', status: 'ok' }, days: 18 },
  ];
  const p = plants[1];

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden' }}>
      {/* dimmed background — static snapshot of screen 2 */}
      <div style={{ position: 'absolute', inset: 0, filter: 'brightness(.55)', pointerEvents: 'none' }}>
        <Screen2 pose={pose} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />

      {/* bottom sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: `${((RP.density && RP.density.sheetH) || 0.58) * 100}%`,
        background: RP.bg,
        borderTopLeftRadius: 28 * RP.radius, borderTopRightRadius: 28 * RP.radius,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: RP.borderStrong }} />
        </div>

        {/* sheet header */}
        <div style={{ padding: '6px 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14 * RP.radius,
            backgroundImage: `url(${p.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            flexShrink: 0, border: `1px solid ${RP.border}`,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4, fontFamily: RP.fontDisplay }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11.5, color: RP.textMuted, fontStyle: 'italic' }}>
              {p.sub}
            </div>
            <div style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 999,
              background: RP.accentSoft, color: RP.accent,
              fontSize: 10.5, fontWeight: 600,
            }}>
              {Ico.leaf(RP.accent, 10)} {p.stage} · Tag {p.days}
            </div>
          </div>
          <button style={{
            width: 32, height: 32, borderRadius: 16,
            border: 'none', background: RP.chipBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {Ico.close(RP.text, 15)}
          </button>
        </div>

        {/* stat row */}
        <div style={{ padding: '6px 16px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile icon={Ico.dropFill(RP.water, 14)} label="Heute" value="Giessen" highlight />
          <StatTile icon={Ico.sun('#e0893a', 14)} label="Sonne" value="Voll" />
          <StatTile icon={Ico.thermo(RP.text, 14)} label="Temp." value="22°" />
        </div>

        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 24px' }}>
          {/* next action callout */}
          <div style={{
            padding: '12px 14px', borderRadius: 14 * RP.radius,
            background: RP.warnSoft, border: `1px solid ${RP.warn}22`,
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: RP.warn,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {Ico.dropFill('#fff', 16)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Heute giessen</div>
              <div style={{ fontSize: 11, color: RP.textMuted }}>Ca. 200 ml · Erde fühlt sich trocken an</div>
            </div>
            <button style={{
              padding: '7px 12px', borderRadius: 10, background: RP.warn,
              color: '#fff', border: 'none', fontWeight: 600, fontSize: 11.5,
            }}>Giessen</button>
          </div>

          {/* quick actions */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: RP.textMuted, marginBottom: 10 }}>
            AKTIONEN
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 22 }}>
            <Action icon={Ico.dropFill(RP.water, 16)} label="Giessen" />
            <Action icon={Ico.leaf(RP.accent, 16)} label="Düngen" />
            <Action icon={Ico.scissors(RP.text, 16)} label="Schnitt" />
            <Action icon={Ico.plus(RP.text, 16)} label="Notiz" />
          </div>

          {/* care meta */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: RP.textMuted, marginBottom: 10 }}>
            PFLEGE
          </div>
          <div style={{
            border: `1px solid ${RP.border}`, borderRadius: 14 * RP.radius, overflow: 'hidden', marginBottom: 22,
          }}>
            <MetaRow k="Giessintervall" v="Alle 1–2 Tage" />
            <MetaRow k="Letztes Giessen" v="Vorgestern, 18:40" />
            <MetaRow k="Sonnenbedarf" v="Vollsonne · 6–8 h" />
            <MetaRow k="Gepflanzt am" v="14. März 2026" last />
          </div>

          {/* notes / protokoll */}
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: RP.textMuted, marginBottom: 10 }}>
            PROTOKOLL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
            <LogRow date="22.04." title="Erste Blüten" body="Weisse Knospen an drei Zweigen entdeckt." />
            <LogRow date="19.04." title="Gegossen" body="200 ml · Erde war leicht feucht." />
            <LogRow date="14.04." title="Umgetopft" body="In Terrakottatopf mit Kräutererde." />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon, label, value, highlight }) {
  return (
    <div style={{
      padding: '9px 10px', borderRadius: 12,
      background: highlight ? RP.waterSoft : '#fff',
      border: `1px solid ${highlight ? RP.water + '33' : RP.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: RP.textMuted, fontWeight: 500 }}>
        {icon}{label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 3, color: highlight ? RP.water : RP.text }}>
        {value}
      </div>
    </div>
  );
}

function Action({ icon, label }) {
  return (
    <div style={{
      padding: '10px 6px', borderRadius: 14 * RP.radius,
      border: `1px solid ${RP.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      background: RP.bg,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 15, background: RP.chipBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ fontSize: 10.5, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function MetaRow({ k, v, last }) {
  return (
    <div style={{
      padding: '11px 14px',
      borderBottom: last ? 'none' : `1px solid ${RP.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 12.5,
    }}>
      <span style={{ color: RP.textMuted }}>{k}</span>
      <span style={{ fontWeight: 600, color: RP.text }}>{v}</span>
    </div>
  );
}

function LogRow({ date, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{
        fontSize: 10.5, color: RP.textMuted, fontWeight: 600,
        width: 44, flexShrink: 0, paddingTop: 1,
        fontFeatureSettings: '"tnum"',
      }}>
        {date}
      </div>
      <div style={{ flex: 1, borderLeft: `1px solid ${RP.border}`, paddingLeft: 12, paddingBottom: 4, position: 'relative' }}>
        <div style={{
          position: 'absolute', left: -4, top: 4, width: 7, height: 7, borderRadius: 4,
          background: RP.accent, boxShadow: `0 0 0 2px #fff`,
        }} />
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 11.5, color: RP.textMuted, marginTop: 2, lineHeight: 1.4 }}>{body}</div>
      </div>
    </div>
  );
}

// static snapshot of screen 2 used as dimmed background for the sheet
function Screen2Static() {
  return <Screen2 />;
}

// ═════════════════════════════════════════════════════════════
// SCREEN 4 — Giessen (watering overview)
// ═════════════════════════════════════════════════════════════
function Screen4() {
  const pots = [
    { name: 'Tomaten-Kübel',  plants: 'Cherry-Tomate',        img: PLANT_IMG.tomate,    due: 'due',  label: 'Seit 2 Tagen trocken', ml: 400, lastMl: 300, lastDays: 2 },
    { name: 'Beeren-Kiste',   plants: 'Erdbeere, Mangold',    img: PLANT_IMG.erdbeere,  due: 'warn', label: 'Heute giessen',        ml: 300, lastMl: 250, lastDays: 1 },
    { name: 'Kräuter-Box',    plants: 'Basilikum, Salbei',    img: PLANT_IMG.basilikum, due: 'ok',   label: 'Morgen',               ml: 150, lastMl: 150, lastDays: 0 },
    { name: 'Rosmarin-Topf',  plants: 'Rosmarin',             img: PLANT_IMG.rosmarin,  due: 'ok',   label: 'In 2 Tagen',           ml: 200, lastMl: 200, lastDays: 0 },
  ];
  const dueNow = pots.filter(p => p.due !== 'ok');
  const later  = pots.filter(p => p.due === 'ok');
  const totalToday = dueNow.reduce((a, p) => a + p.ml, 0);

  return (
    <div style={{ position: 'absolute', inset: 0, background: RP.bg, display: 'flex', flexDirection: 'column', fontFamily: RP.font }}>
      <div style={{ height: 54 }} />
      {/* header */}
      <div style={{ padding: '6px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ background: 'none', border: 'none', padding: 6, marginLeft: -6, color: RP.text }}>
          {Ico.menu(RP.text, 22)}
        </button>
        <div style={{ fontSize: 13, color: RP.textMuted, fontWeight: 500 }}>Heute · 24.04</div>
        <div style={{ position: 'relative' }}>
          {Ico.bell(RP.text, 22)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {/* big title + summary */}
        <div style={{ padding: '4px 20px 20px' }}>
          <div style={{
            fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
            fontFamily: RP.fontDisplay, lineHeight: 1.1,
          }}>
            Giessen
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: RP.textMuted }}>
            {dueNow.length === 0 ? 'Alles gegossen · heute frei' :
              `${dueNow.length} Topf${dueNow.length > 1 ? 'e' : ''} · ca. ${totalToday} ml heute`}
          </div>
        </div>

        {/* section: fällig heute */}
        {dueNow.length > 0 && (
          <>
            <SectionHead label={`FÄLLIG HEUTE · ${dueNow.length}`} right="Automatisch planen" />
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dueNow.map((p, i) => <PotWaterRow key={i} p={p} />)}
            </div>
          </>
        )}

        {/* section: upcoming */}
        <SectionHead label="DEMNÄCHST" />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {later.map((p, i) => <PotWaterRow key={i} p={p} compact />)}
        </div>

        {/* 7-day forecast */}
        <SectionHead label="7 TAGE" />
        <div style={{ padding: '0 16px 20px' }}>
          <WeekBars />
        </div>
      </div>

      <TabBar active="giessen" />
    </div>
  );
}

function WaterRing({ percent, total }) {
  const size = 84;
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(percent, 100) / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke={RP.border} strokeWidth="6" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={RP.accent} strokeWidth="6" fill="none"
                strokeDasharray={c} strokeDashoffset={off}
                strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', lineHeight: 1,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4, fontFamily: RP.fontDisplay }}>{percent}%</div>
        <div style={{ fontSize: 9, color: RP.textMuted, marginTop: 3 }}>heute</div>
      </div>
    </div>
  );
}

function SectionHead({ label, right }) {
  return (
    <div style={{
      padding: '14px 20px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: RP.textMuted }}>{label}</div>
      {right && <div style={{ fontSize: 12, color: RP.textMuted, fontWeight: 500 }}>{right}</div>}
    </div>
  );
}

function PotWaterRow({ p, compact }) {
  const style = {
    ok:   { bg: RP.accentSoft, fg: RP.accent, dotBg: RP.accent, dotFg: '#fff' },
    warn: { bg: RP.warnSoft,   fg: RP.warn,   dotBg: RP.warn,   dotFg: '#fff' },
    due:  { bg: '#fdecea',     fg: RP.danger, dotBg: RP.danger, dotFg: '#fff' },
  }[p.due];

  return (
    <div style={{
      borderRadius: 16 * RP.radius,
      background: RP.bg,
      border: `1px solid ${RP.border}`,
      padding: '10px 12px 10px 10px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12 * RP.radius,
        backgroundImage: `url(${p.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.2 }}>{p.name}</div>
          <div style={{
            fontSize: 9.5, fontWeight: 700, letterSpacing: 0.3,
            padding: '2px 6px', borderRadius: 6,
            background: style.bg, color: style.fg,
          }}>
            {p.label.toUpperCase()}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: RP.textMuted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {p.plants}
        </div>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <MiniStat label="Menge" value={`${p.ml} ml`} />
            <div style={{ width: 1, height: 18, background: RP.border }} />
            <MiniStat label="Letzte" value={p.lastDays === 0 ? 'heute' : p.lastDays === 1 ? 'gestern' : `vor ${p.lastDays} T.`} />
            <div style={{ width: 1, height: 18, background: RP.border }} />
            <MiniStat label="Bedarf" value="Hoch" />
          </div>
        )}
      </div>
      <button style={{
        width: 38, height: 38, borderRadius: 19 * RP.radius,
        background: style.dotBg, color: style.dotFg, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {Ico.dropFill(style.dotFg, 16)}
      </button>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontSize: 9, color: RP.textFaint, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: RP.text, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function WeekBars() {
  const days = [
    { d: 'Do', n: '24.', ml: 700, today: true },
    { d: 'Fr', n: '25.', ml: 250 },
    { d: 'Sa', n: '26.', ml: 450 },
    { d: 'So', n: '27.', ml: 0, rain: true },
    { d: 'Mo', n: '28.', ml: 300 },
    { d: 'Di', n: '29.', ml: 500 },
    { d: 'Mi', n: '30.', ml: 400 },
  ];
  const max = 800;
  return (
    <div style={{
      border: `1px solid ${RP.border}`,
      borderRadius: 16 * RP.radius,
      padding: '14px 10px 10px',
      background: RP.bg,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4,
      height: 130,
    }}>
      {days.map((d, i) => {
        const h = d.rain ? 0 : (d.ml / max) * 80;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 6 }}>
            <div style={{
              fontSize: 9, fontWeight: 600,
              color: d.today ? RP.accent : RP.textFaint,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {d.rain ? '☂' : `${d.ml}`}
            </div>
            <div style={{
              width: '70%', minHeight: 4,
              height: Math.max(h, 4),
              borderRadius: 4 * RP.radius,
              background: d.rain ? RP.waterSoft : (d.today ? RP.accent : RP.accentSoft),
              border: d.rain ? `1px dashed ${RP.water}` : 'none',
            }} />
            <div style={{
              fontSize: 10, fontWeight: d.today ? 700 : 500,
              color: d.today ? RP.text : RP.textMuted,
            }}>{d.d}</div>
            <div style={{ fontSize: 8.5, color: RP.textFaint, marginTop: -2 }}>{d.n}</div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { Screen1, Screen2, Screen3, Screen4, Phone, RP, VibeProvider });
