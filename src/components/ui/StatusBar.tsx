import { VIBES, TYPE } from '../../tokens'

interface StatusBarProps {
  dark?: boolean
  time?: string
  vibe?: keyof typeof VIBES
}

export default function StatusBar({ dark = false, time = '09:41', vibe = 'terracotta' }: StatusBarProps) {
  const fg = dark ? '#fff' : VIBES[vibe].text
  return (
    <div style={{
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 32px 0',
      fontSize: 16,
      fontWeight: TYPE.weight.semibold,
      color: fg,
      fontVariantNumeric: 'tabular-nums',
      flexShrink: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      <span>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="11" viewBox="0 0 18 11" fill={fg}>
          <rect x="0" y="6" width="3" height="5" rx="0.7"/>
          <rect x="4.5" y="4" width="3" height="7" rx="0.7"/>
          <rect x="9" y="2" width="3" height="9" rx="0.7"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.7"/>
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={fg}>
          <path d="M8 3C10 3 12 4 13 5l1-1C13 3 11 2 8 2S3 3 2 4l1 1c1-1 3-2 5-2z"/>
          <path d="M8 6c1 0 2 .5 3 1l1-1c-1-1-2-1.5-4-1.5S4 5 3 6l1 1c1-.5 2-1 4-1z"/>
          <circle cx="8" cy="9.5" r="1.5"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={fg} strokeOpacity="0.4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill={fg}/>
          <path d="M24 4v4c.6-.2 1-.8 1-2s-.4-1.8-1-2z" fill={fg} opacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}
