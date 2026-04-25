import { VIBES, TYPE } from '../../tokens'
import type { TabId, ScreenId } from '../../types'
import { IconPlant, IconCalendar, IconDrop } from './Icons'

interface TabBarProps {
  active: TabId
  onNavigate: (target: ScreenId) => void
  vibe?: keyof typeof VIBES
}

const TABS: { id: TabId; label: string; screen: ScreenId; Icon: React.FC<{ color?: string; size?: number }> }[] = [
  { id: 'garten',   label: 'Garten',  screen: 'garten',  Icon: IconPlant },
  { id: 'kalender', label: 'Kalender',screen: 'kalender', Icon: IconCalendar },
  { id: 'giessen',  label: 'Giessen', screen: 'giessen', Icon: IconDrop },
]

export default function TabBar({ active, onNavigate, vibe = 'terracotta' }: TabBarProps) {
  const V = VIBES[vibe]
  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      paddingBottom: 28,
      paddingTop: 10,
      background: V.bg,
      borderTop: `1px solid ${V.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 40,
    }}>
      {TABS.map(({ id, label, screen, Icon }) => {
        const on = id === active
        const color = on ? V.text : V.textFaint
        return (
          <button
            key={id}
            onClick={() => onNavigate(screen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, minWidth: 60,
              padding: 0,
            }}
          >
            <Icon color={color} size={23} />
            <span style={{
              fontSize: 10.5,
              color,
              fontWeight: on ? TYPE.weight.semibold : TYPE.weight.medium,
              letterSpacing: 0.1,
              fontFamily: TYPE.fontSans,
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
