import { useState } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import { WEATHER as MOCK_WEATHER } from '../../data/mockData'
import { useWeather } from '../../hooks/useWeather'
import { useApp } from '../../context/AppContext'
import type { WaterStatus, WeatherDay, NavProps } from '../../types'
import StatusBar from '../ui/StatusBar'
import TabBar from '../ui/TabBar'
import ContainerModal from '../ui/ContainerModal'
import { IconMenu, IconBell, IconPlus, IconDropFill, IconChevronRight } from '../ui/Icons'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const WATER_STYLE: Record<WaterStatus, { bg: string; fg: string }> = {
  ok:   { bg: V.accentSoft, fg: V.accent },
  warn: { bg: V.warnSoft,   fg: V.warn   },
  due:  { bg: '#f7dedd',    fg: V.danger  },
}

// ─── Weather pill ─────────────────────────────────────────────

function WeatherPill({ w }: { w: WeatherDay }) {
  return (
    <div style={{
      minWidth: sp(46), flex: '0 0 auto',
      padding: `${sp(7)}px 0 ${sp(8)}px`,
      borderRadius: r(14),
      border: `1px solid ${w.isToday ? V.text : V.border}`,
      background: w.isToday ? V.text : V.bg,
      color: w.isToday ? V.bg : w.isPast ? V.textFaint : V.text,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp(2),
      opacity: w.isPast ? 0.55 : 1,
      fontVariantNumeric: 'tabular-nums',
    }}>
      <span style={{ fontSize: fs(9.5), fontWeight: TYPE.weight.semibold, letterSpacing: 0.2, textTransform: 'uppercase' }}>
        {w.isToday ? 'HEUTE' : w.day}
      </span>
      <span style={{ fontSize: fs(9), opacity: 0.5 }}>{w.date}</span>
      <span style={{ fontSize: fs(14), fontWeight: TYPE.weight.bold, marginTop: sp(2), letterSpacing: -0.3 }}>{w.temp}</span>
      <span style={{ fontSize: fs(9), opacity: 0.55, display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ width: 4, height: 4, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} />
        {w.sun}
      </span>
    </div>
  )
}

function WeatherStrip({ days, loading }: { days: WeatherDay[]; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', gap: sp(6) }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-pulse" style={{
            minWidth: sp(46), height: sp(80), flex: '0 0 auto',
            borderRadius: r(14), background: V.chipBg,
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', gap: sp(6) }}>
      {days.map((w, i) => <WeatherPill key={i} w={w} />)}
    </div>
  )
}

function FrostBanner() {
  return (
    <div style={{
      margin: `0 ${sp(16)}px ${sp(12)}px`,
      padding: `${sp(10)}px ${sp(14)}px`,
      borderRadius: r(14),
      background: V.waterSoft, border: `1px solid ${V.water}33`,
      display: 'flex', alignItems: 'center', gap: sp(8),
      fontSize: fs(12), color: V.water, fontWeight: TYPE.weight.semibold,
    }}>
      <span style={{ fontSize: fs(15), flexShrink: 0 }}>❄</span>
      <span>Frostwarnung: Temperaturen unter 4 °C erwartet</span>
    </div>
  )
}

// ─── Screen 1 ─────────────────────────────────────────────────

export default function Screen1({ onNavigate }: NavProps) {
  const { days: apiDays, loading, hasFrost } = useWeather()
  const { containers, setActiveContainer, addContainer } = useApp()
  const [showModal, setShowModal] = useState(false)

  const weatherDays  = apiDays.length > 0 ? apiDays : MOCK_WEATHER
  const dueCount     = containers.filter(c => c.water.status !== 'ok').length
  const totalPlants  = containers.reduce((a, c) => a + c.plants.length, 0)
  const subtitle     = dueCount > 0
    ? `${dueCount} Topf braucht Wasser · ${containers.length - dueCount} in Ordnung`
    : 'Alle Töpfe gut versorgt'

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: V.bg, display: 'flex', flexDirection: 'column',
      fontFamily: TYPE.fontSans, color: V.text, overflow: 'hidden',
    }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        padding: `${sp(6)}px ${sp(20)}px ${sp(10)}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <button style={{ background: 'none', border: 'none', padding: sp(6), marginLeft: -sp(6), color: V.text, cursor: 'pointer' }}>
          <IconMenu color={V.text} size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp(6), fontSize: fs(13), color: V.textMuted, fontWeight: TYPE.weight.medium }}>
          <span style={{ fontSize: fs(15) }}>☀︎</span>
          <span>Zürich</span>
        </div>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <IconBell color={V.text} size={22} />
          <div style={{
            position: 'absolute', top: -3, right: -3,
            width: 16, height: 16, borderRadius: 8,
            background: V.danger, color: '#fff',
            fontSize: 9, fontWeight: TYPE.weight.bold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${V.bg}`,
          }}>2</div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {!loading && hasFrost && <FrostBanner />}

        <div style={{ padding: `${sp(2)}px ${sp(16)}px ${sp(20)}px`, overflowX: 'auto' }}>
          <WeatherStrip days={weatherDays} loading={loading} />
        </div>

        <div style={{ padding: `0 ${sp(20)}px ${sp(16)}px` }}>
          <h1 style={{
            fontSize: fs(TYPE.size.heading), fontWeight: TYPE.weight.bold,
            letterSpacing: TYPE.tracking.tight, fontFamily: TYPE.fontDisplay,
            lineHeight: 1.1, margin: 0, color: V.text,
          }}>Dein Dachgarten</h1>
          <div style={{ marginTop: sp(10), display: 'flex', alignItems: 'center', gap: sp(8), fontSize: fs(13), color: V.textMuted }}>
            <span style={{
              width: 8, height: 8, borderRadius: 4, flexShrink: 0,
              background: dueCount > 0 ? V.warn : V.accent,
              boxShadow: `0 0 0 3px ${dueCount > 0 ? V.warnSoft : V.accentSoft}`,
            }} />
            <span>{subtitle}</span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: `0 ${sp(16)}px ${sp(22)}px`, display: 'flex', gap: sp(8) }}>
          {[
            { v: containers.length, l: 'Töpfe'   },
            { v: totalPlants,       l: 'Pflanzen' },
            { v: 12,                l: 'L Wasser' },
          ].map(({ v, l }) => (
            <div key={l} style={{
              padding: `${sp(14)}px ${sp(12)}px`,
              border: `1px solid ${V.border}`, borderRadius: r(16),
              background: V.bg, flex: 1,
            }}>
              <div style={{ fontSize: fs(24), fontWeight: TYPE.weight.bold, letterSpacing: -0.5, fontFamily: TYPE.fontDisplay, color: V.text, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: fs(11), color: V.textMuted, marginTop: sp(4) }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ padding: `${sp(4)}px ${sp(20)}px ${sp(12)}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: fs(11), fontWeight: TYPE.weight.semibold, letterSpacing: TYPE.tracking.section, color: V.textMuted, textTransform: 'uppercase' }}>
            Container
          </span>
          <span style={{ fontSize: fs(12), color: V.textMuted, fontWeight: TYPE.weight.medium }}>{containers.length} gesamt</span>
        </div>

        {/* Container cards */}
        <div style={{ padding: `0 ${sp(16)}px`, display: 'flex', flexDirection: 'column', gap: sp(10) }}>
          {containers.map(c => {
            const ws       = WATER_STYLE[c.water.status]
            const imgSrc   = c.photoBase64 ? `data:image/jpeg;base64,${c.photoBase64}` : c.imgUrl
            const names    = c.plants.map(p => p.name).join(', ') || 'Keine Pflanzen'
            const count    = c.plants.length
            return (
              <div
                key={c.id}
                onClick={() => { setActiveContainer(c.id); onNavigate('container-detail') }}
                style={{
                  borderRadius: r(18), background: V.bg,
                  border: `1px solid ${V.border}`, overflow: 'hidden',
                  display: 'flex', cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(90,54,28,0.04)',
                }}
              >
                <div style={{
                  width: sp(100), height: sp(100), flexShrink: 0,
                  backgroundImage: `url(${imgSrc})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundColor: V.accentSoft,
                }} />
                <div style={{
                  flex: 1, padding: `${sp(13)}px ${sp(14)}px`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  minWidth: 0, gap: sp(8),
                }}>
                  <div>
                    <div style={{ fontSize: fs(15), fontWeight: TYPE.weight.semibold, letterSpacing: -0.2, color: V.text }}>{c.name}</div>
                    <div style={{ fontSize: fs(12), color: V.textMuted, marginTop: sp(3), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {count} {count === 1 ? 'Pflanze' : 'Pflanzen'} · {names}
                    </div>
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: sp(5),
                    padding: `${sp(4)}px ${sp(9)}px`, borderRadius: 999,
                    background: ws.bg, color: ws.fg,
                    alignSelf: 'flex-start', fontSize: fs(11), fontWeight: TYPE.weight.semibold,
                  }}>
                    <IconDropFill color={ws.fg} size={11} />
                    {c.water.label}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingRight: sp(14), color: V.textFaint }}>
                  <IconChevronRight color={V.textFaint} size={18} />
                </div>
              </div>
            )
          })}

          {containers.length === 0 && (
            <div style={{
              padding: `${sp(32)}px ${sp(20)}px`,
              textAlign: 'center', color: V.textMuted, fontSize: fs(13),
            }}>
              Noch keine Container.<br />Tippe auf + um einen zu erstellen.
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'absolute', bottom: 100, right: sp(18), zIndex: 45,
          width: sp(54), height: sp(54), borderRadius: sp(27),
          background: V.text, color: V.bg, border: 'none',
          boxShadow: '0 10px 28px -5px rgba(43,31,22,0.4), 0 4px 10px rgba(43,31,22,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <IconPlus color={V.bg} size={24} />
      </button>

      <TabBar active="garten" onNavigate={onNavigate} />

      {showModal && (
        <ContainerModal
          mode="create"
          onClose={() => setShowModal(false)}
          onSave={draft => addContainer(draft)}
        />
      )}
    </div>
  )
}
