// Design tokens extracted from screens.jsx
// Three vibes: gallery (default), terracotta, nordic

export const VIBES = {
  gallery: {
    bg: '#ffffff',
    text: '#111315',
    textMuted: '#6b7280',
    textFaint: '#9ca3af',
    border: 'rgba(0,0,0,0.06)',
    borderStrong: 'rgba(0,0,0,0.12)',
    accent: '#3a7d44',
    accentSoft: '#e8f1ea',
    water: '#3b82f6',
    waterSoft: '#eaf2ff',
    warn: '#e0893a',
    warnSoft: '#fcefe1',
    danger: '#c0392b',
    chipBg: '#f4f4f2',
    radiusMultiplier: 1,
    shadow: '0 20px 45px -15px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.05)',
  },
  terracotta: {
    bg: '#fbf6ee',
    text: '#2b1f16',
    textMuted: '#7b6653',
    textFaint: '#b8a48f',
    border: 'rgba(90,54,28,0.10)',
    borderStrong: 'rgba(90,54,28,0.18)',
    accent: '#7a8a4a',
    accentSoft: '#edeed9',
    water: '#5b7da3',
    waterSoft: '#e4ecf3',
    warn: '#c05a2a',
    warnSoft: '#f7e3d4',
    danger: '#a93826',
    chipBg: '#f1e9dc',
    radiusMultiplier: 1.25,
    shadow: '0 22px 50px -18px rgba(100,60,20,0.28), 0 4px 12px rgba(90,54,28,0.08)',
  },
  nordic: {
    bg: '#f5f5f3',
    text: '#0a0a0a',
    textMuted: '#555555',
    textFaint: '#888888',
    border: 'rgba(0,0,0,0.14)',
    borderStrong: 'rgba(0,0,0,0.3)',
    accent: '#0a0a0a',
    accentSoft: '#e6e6e3',
    water: '#0a0a0a',
    waterSoft: '#e6e6e3',
    warn: '#0a0a0a',
    warnSoft: '#e6e6e3',
    danger: '#0a0a0a',
    chipBg: '#ebeae6',
    radiusMultiplier: 0.35,
    shadow: '0 2px 0 rgba(0,0,0,0.9)',
  },
} as const;

export type VibeName = keyof typeof VIBES;

export const DENSITY = {
  zen:      { spaceMultiplier: 1.35, fontScale: 1.05, cardH: 450, sheetH: 0.62 },
  balanced: { spaceMultiplier: 1,    fontScale: 1,    cardH: 420, sheetH: 0.58 },
  packed:   { spaceMultiplier: 0.75, fontScale: 0.92, cardH: 380, sheetH: 0.55 },
} as const;

export type DensityName = keyof typeof DENSITY;

// Base radii (multiplied by vibe.radiusMultiplier at runtime)
export const BASE_RADII = {
  phone: 44,
  card: 18,
  plantCard: 22,
  pill: 9999,
  sheet: 28,
  container: 14,
  chip: 12,
  stat: 12,
  action: 14,
  dot: 4,
} as const;

// Typography scale (px values matching design)
export const TYPE = {
  // Font families
  fontSans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
  fontDisplay: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif',

  // Size scale
  size: {
    heading:  28,   // main screen titles
    title:    19,   // sheet / card title
    bodyLg:   15,   // card name
    body:     13,   // default body
    bodySm:   12.5, // meta rows
    caption:  12,   // secondary body
    chip:     11,   // status chips / sections
    small:    10.5, // tab labels
    tiny:     9.5,  // weather strip, section uppercase
    micro:    8.5,  // chart labels
  },

  // Weight scale
  weight: {
    bold:     700,
    semibold: 600,
    medium:   500,
    regular:  400,
  },

  // Letter spacing
  tracking: {
    tight:    -0.5,  // display headings
    normal:    0,
    section:   1.2,  // ALL-CAPS section labels
  },
} as const;

// Phone frame dimensions (iPhone 14 viewport in design)
export const PHONE = {
  width: 390,
  height: 780,
  statusBarHeight: 54,
  tabBarHeight: 82,
  homeIndicatorHeight: 26,
} as const;

// Default vibe used throughout the app (can be swapped at runtime)
export const DEFAULT_VIBE: VibeName = 'gallery';
export const DEFAULT_DENSITY: DensityName = 'balanced';
