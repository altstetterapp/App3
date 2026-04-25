import { useState } from 'react'
import { PHONE } from './tokens'
import type { ScreenId } from './types'
import { AppProvider } from './context/AppContext'
import LoginScreen from './components/screens/LoginScreen'
import Screen1 from './components/screens/Screen1'
import Screen2 from './components/screens/Screen2'
import Screen3 from './components/screens/Screen3'
import Screen4 from './components/screens/Screen4'
import Screen5 from './components/screens/Screen5'

const SCREEN_LABELS: Record<ScreenId, string> = {
  'garten':           'S1 · Garten',
  'container-detail': 'S2 · Detail',
  'plant-profile':    'S3 · Pflanze',
  'giessen':          'S4 · Giessen',
  'kalender':         'S5 · Kalender',
}

const ALL_SCREENS: ScreenId[] = ['garten', 'container-detail', 'plant-profile', 'giessen', 'kalender']

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('rp_auth') === '1')
  const [active, setActive] = useState<ScreenId>('garten')

  function renderScreen() {
    switch (active) {
      case 'garten':           return <Screen1 onNavigate={setActive} />
      case 'container-detail': return <Screen2 onNavigate={setActive} />
      case 'plant-profile':    return <Screen3 onNavigate={setActive} />
      case 'giessen':          return <Screen4 onNavigate={setActive} />
      case 'kalender':         return <Screen5 onNavigate={setActive} />
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#f0eee9',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M120 0H0v120\' fill=\'none\' stroke=\'rgba(0,0,0,0.055)\' stroke-width=\'1\'/%3E%3C/svg%3E")',
      backgroundSize: '120px 120px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px 60px',
      gap: 24,
    }}>
      {/* Screen switcher — only when authed */}
      {authed && (
        <div style={{
          display: 'flex', gap: 8,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          padding: '6px 8px',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {ALL_SCREENS.map(id => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: active === id ? '#2b1f16' : 'transparent',
                color: active === id ? '#fbf6ee' : '#7b6653',
                fontSize: 12, fontWeight: active === id ? 600 : 500,
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif',
                transition: 'all .15s',
              }}
            >
              {SCREEN_LABELS[id]}
            </button>
          ))}
        </div>
      )}

      {/* Phone frame */}
      <div style={{
        width: PHONE.width, height: PHONE.height,
        borderRadius: 44, overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 40px 80px -20px rgba(43,31,22,0.3)',
        flexShrink: 0, position: 'relative',
      }}>
        {authed ? (
          <AppProvider>
            {renderScreen()}
          </AppProvider>
        ) : (
          <LoginScreen onSuccess={() => setAuthed(true)} />
        )}
      </div>
    </div>
  )
}
