import { useMemo, useState } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import type { WaterStatus, NavProps, ContainerData, WateringEvent } from '../../types'
import { useApp } from '../../context/AppContext'
import { useWeather } from '../../hooks/useWeather'
import StatusBar from '../ui/StatusBar'
import TabBar from '../ui/TabBar'
import { IconBell, IconDropFill } from '../ui/Icons'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const DE_DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const WATER_STYLE: Record<WaterStatus, { bg: string; fg: string; btnBg: string; btnFg: string }> = {
  ok:   { bg: V.accentSoft, fg: V.accent,  btnBg: V.accent,  btnFg: '#fff' },
  warn: { bg: V.warnSoft,   fg: V.warn,    btnBg: V.warn,    btnFg: '#fff' },
  due:  { bg: '#f7dedd',    fg: V.danger,  btnBg: V.danger,  btnFg: '#fff' },
}

// ─── Data helpers ─────────────────────────────────────────────

interface PotItem {
  containerId: string
  name: string
  plantNames: string
  imgSrc: string
  status: WaterStatus
  label: string
  ml: number
  lastDays: number
  irrigated: boolean
}

function defaultMl(c: ContainerData): number {
  if (c.mlPerWeek) return Math.round(c.mlPerWeek / 3.5)
  const names = c.plants.map(p => p.name.toLowerCase()).join(' ')
  if (/tomate|cherry/.test(names)) return 400
  if (/erdbeere/.test(names))      return 250
  if (/basilikum|mangold/.test(names)) return 200
  if (/chili/.test(names))         return 180
  return 150
}

function lastDaysAgo(containerId: string, events: WateringEvent[]): number {
  const evts = events.filter(e => e.containerId === containerId)
  if (!evts.length) return 99
  const latest = evts.reduce((a, b) => (a.date > b.date ? a : b))
  return Math.floor((Date.now() - new Date(latest.date).getTime()) / 86_400_000)
}

function buildPotItems(containers: ContainerData[], events: WateringEvent[]): PotItem[] {
  return containers
    .filter(c => c.plants.length > 0)
    .map(c => ({
      containerId: c.id,
      name: c.name,
      plantNames: c.plants.map(p => p.name).join(', '),
      imgSrc: c.photoBase64 ? `data:image/jpeg;base64,${c.photoBase64}` : c.imgUrl,
      status: c.water.status,
      label: c.water.label,
      ml: defaultMl(c),
      lastDays: lastDaysAgo(c.id, events),
      irrigated: c.irrigated,
    }))
}

// ─── Bar chart helpers ────────────────────────────────────────

interface BarDay {
  iso: string
  day: string
  date: string
  ml: number
  precip: number   // mm from weather, all days
  rain: boolean    // future day with precip > 2mm (skip watering)
  today: boolean
  isPast: boolean
}

function buildPrecipMap(weatherDays: ReturnType<typeof useWeather>['days']): Record<string, number> {
  const yr = new Date().getFullYear()
  const map: Record<string, number> = {}
  for (const w of weatherDays) {
    const [d, m] = w.date.split('.')
    map[`${yr}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`] = w.precip
  }
  return map
}

function build7DayBars(events: WateringEvent[], precipMap: Record<string, number>): BarDay[] {
  const now = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const offset = i - 3
    const d = new Date(now)
    d.setDate(d.getDate() + offset)
    const iso = d.toISOString().slice(0, 10)
    const isPast  = offset < 0
    const isToday = offset === 0
    const ml = (isPast || isToday)
      ? events.filter(e => e.date === iso).reduce((s, e) => s + (e.ml ?? 0), 0)
      : 0
    const precip = Math.round((precipMap[iso] ?? 0) * 10) / 10
    const rain   = offset > 0 && precip > 2
    return {
      iso, day: DE_DAYS[d.getDay()],
      date: `${d.getDate()}.${d.getMonth() + 1}.`,
      ml, precip, rain, today: isToday, isPast,
    }
  })
}

// ─── Sub-components ───────────────────────────────────────────

function SectionHead({ label, right, onRight }: { label: string; right?: string; onRight?: () => void }) {
  return (
    <div style={{
      padding: `${sp(14)}px ${sp(20)}px ${sp(10)}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: fs(11), fontWeight: TYPE.weight.semibold, letterSpacing: TYPE.tracking.section, color: V.textMuted, textTransform: 'uppercase' }}>
        {label}
      </span>
      {right && (
        <button
          onClick={onRight}
          style={{ fontSize: fs(12), color: V.accent, fontWeight: TYPE.weight.semibold, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {right}
        </button>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ lineHeight: 1.1 }}>
      <div style={{ fontSize: fs(9), color: V.textFaint, fontWeight: TYPE.weight.semibold, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: fs(11.5), fontWeight: TYPE.weight.semibold, color: V.text, marginTop: sp(2) }}>{value}</div>
    </div>
  )
}

function PotRow({
  item, compact, onWater, autoPlanned,
}: {
  item: PotItem
  compact?: boolean
  onWater: (item: PotItem) => void
  autoPlanned: boolean
}) {
  const s = WATER_STYLE[item.status]
  const lastLabel = item.lastDays === 0 ? 'heute' : item.lastDays === 1 ? 'gestern' : item.lastDays >= 99 ? '—' : `vor ${item.lastDays} T.`

  return (
    <div style={{
      borderRadius: r(16), background: V.bg,
      border: `1px solid ${V.border}`,
      padding: `${sp(10)}px ${sp(12)}px ${sp(10)}px ${sp(10)}px`,
      display: 'flex', alignItems: 'center', gap: sp(12),
    }}>
      {/* Image */}
      <div style={{
        width: sp(52), height: sp(52), borderRadius: r(12),
        backgroundImage: `url(${item.imgSrc})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        flexShrink: 0, backgroundColor: V.accentSoft,
      }} />

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: sp(6) }}>
          <span style={{ fontSize: fs(14), fontWeight: TYPE.weight.semibold, letterSpacing: -0.2, color: V.text }}>{item.name}</span>
          <span style={{
            fontSize: fs(9.5), fontWeight: TYPE.weight.bold, letterSpacing: 0.3,
            padding: `${sp(2)}px ${sp(6)}px`, borderRadius: r(6),
            background: s.bg, color: s.fg, textTransform: 'uppercase',
          }}>{item.label}</span>
        </div>
        <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.plantNames}
        </div>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: sp(10), marginTop: sp(6) }}>
            <MiniStat label="Menge"  value={`${item.ml} ml`} />
            <div style={{ width: 1, height: 18, background: V.border }} />
            <MiniStat label="Letzte" value={lastLabel} />
          </div>
        )}
      </div>

      {/* Action area */}
      {item.irrigated ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp(3),
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 18 }}>⚙️</span>
          <span style={{
            fontSize: fs(9), color: autoPlanned ? V.accent : V.textMuted,
            fontWeight: TYPE.weight.semibold, whiteSpace: 'nowrap',
          }}>
            {autoPlanned ? 'Geplant' : 'Automatisch'}
          </span>
        </div>
      ) : (
        <button
          onClick={() => onWater(item)}
          style={{
            width: sp(38), height: sp(38), borderRadius: r(19),
            background: s.btnBg, color: s.btnFg, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'pointer',
            transition: 'transform .1s, opacity .1s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(.93)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <IconDropFill color={s.btnFg} size={16} />
        </button>
      )}
    </div>
  )
}

// ─── Bar chart ────────────────────────────────────────────────

function WeekBars({ bars }: { bars: BarDay[] }) {
  const barMax = Math.max(100, ...bars.map(d => d.ml))

  return (
    <div style={{
      border: `1px solid ${V.border}`, borderRadius: r(16),
      padding: `${sp(14)}px ${sp(10)}px ${sp(10)}px`,
      background: V.bg,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: sp(4),
      height: sp(130),
    }}>
      {bars.map((d) => {
        const isFuture  = !d.isPast && !d.today
        const hasRain   = d.precip > 0
        const barH      = d.rain ? 0 : d.ml > 0 ? Math.max(4, (d.ml / barMax) * 80) : 0
        const barColor  = hasRain
          ? V.water
          : d.today ? V.accent : d.isPast ? V.accentSoft : V.border
        const labelColor = hasRain ? V.water : d.today ? V.accent : V.textFaint

        return (
          <div key={d.iso} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: sp(5),
          }}>
            {/* label: precip mm (blue) or watered ml */}
            <span style={{
              fontSize: fs(9), fontWeight: TYPE.weight.semibold,
              color: labelColor, fontVariantNumeric: 'tabular-nums',
            }}>
              {hasRain
                ? `${d.precip}mm`
                : d.ml > 0 ? d.ml : isFuture ? '' : '—'}
            </span>
            {/* bar */}
            {d.rain ? (
              <div style={{
                width: '68%', height: 20, borderRadius: r(4),
                background: V.water, opacity: 0.55,
              }} />
            ) : (
              <div style={{
                width: '68%',
                height: barH > 0 ? barH : isFuture ? 3 : 0,
                borderRadius: r(4),
                background: barColor,
                opacity: isFuture && !hasRain ? 0.4 : 1,
              }} />
            )}
            {/* day */}
            <span style={{ fontSize: fs(10), fontWeight: d.today ? TYPE.weight.bold : TYPE.weight.medium, color: d.today ? V.text : V.textMuted }}>
              {d.day}
            </span>
            {/* date */}
            <span style={{ fontSize: fs(8.5), color: V.textFaint, marginTop: -sp(3) }}>{d.date}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Screen 4 ─────────────────────────────────────────────────

export default function Screen4({ onNavigate }: NavProps) {
  const { containers, wateringEvents, addWateringEvent, updateContainer } = useApp()
  const { days: weatherDays } = useWeather()
  const [autoPlanned, setAutoPlanned] = useState(false)

  const todayISO = new Date().toISOString().slice(0, 10)
  const todayLabel = (() => {
    const d = new Date()
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
  })()

  const potItems = useMemo(
    () => buildPotItems(containers, wateringEvents),
    [containers, wateringEvents],
  )

  const dueNow  = potItems.filter(p => p.status !== 'ok')
  const later   = potItems.filter(p => p.status === 'ok')
  const totalToday = dueNow.filter(p => !p.irrigated).reduce((s, p) => s + p.ml, 0)

  const precipMap = useMemo(() => buildPrecipMap(weatherDays), [weatherDays])
  const barDays   = useMemo(() => build7DayBars(wateringEvents, precipMap), [wateringEvents, precipMap])

  function handleWater(item: PotItem) {
    const container = containers.find(c => c.id === item.containerId)
    if (!container) return
    const mlPerPlant = Math.round(item.ml / Math.max(1, container.plants.length))
    for (const plant of container.plants) {
      addWateringEvent({
        date: todayISO,
        containerId: item.containerId,
        plantId: plant.id,
        plantName: plant.name,
        ml: mlPerPlant,
      })
    }
    updateContainer(item.containerId, { water: { status: 'ok', label: 'Gerade gegossen' } })
  }

  function handleAutoPlanen() {
    setAutoPlanned(true)
    // Update irrigated containers to 'ok'
    for (const c of containers.filter(c => c.irrigated && c.water.status !== 'ok')) {
      updateContainer(c.id, { water: { status: 'ok', label: 'Automatisch geplant' } })
    }
  }

  const hasAutoContainers = containers.some(c => c.irrigated && c.water.status !== 'ok')

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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ width: 34 }} />
        <span style={{ fontSize: fs(13), color: V.textMuted, fontWeight: TYPE.weight.medium }}>
          Heute · {todayLabel}
        </span>
        <div style={{ padding: sp(6) }}>
          <IconBell color={V.text} size={22} />
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

        {/* Title + summary */}
        <div style={{ padding: `${sp(4)}px ${sp(20)}px ${sp(20)}px` }}>
          <h1 style={{
            fontSize: fs(TYPE.size.heading), fontWeight: TYPE.weight.bold,
            letterSpacing: TYPE.tracking.tight, fontFamily: TYPE.fontDisplay,
            lineHeight: 1.1, margin: 0, color: V.text,
          }}>Giessen</h1>
          <p style={{ fontSize: fs(13), color: V.textMuted, margin: `${sp(8)}px 0 0` }}>
            {dueNow.length === 0
              ? 'Alles gegossen · heute frei'
              : `${dueNow.length} Topf${dueNow.length > 1 ? 'e' : ''} · ca. ${totalToday} ml heute`}
          </p>
        </div>

        {/* Fällig heute */}
        {dueNow.length > 0 && (
          <>
            <SectionHead
              label={`Fällig heute · ${dueNow.length}`}
              right={hasAutoContainers && !autoPlanned ? 'Automatisch planen' : autoPlanned ? '✓ Geplant' : undefined}
              onRight={handleAutoPlanen}
            />
            <div style={{ padding: `0 ${sp(16)}px`, display: 'flex', flexDirection: 'column', gap: sp(10) }}>
              {dueNow.map(p => (
                <PotRow key={p.containerId} item={p} onWater={handleWater} autoPlanned={autoPlanned} />
              ))}
            </div>
          </>
        )}

        {/* Demnächst */}
        {later.length > 0 && (
          <>
            <SectionHead label="Demnächst" />
            <div style={{ padding: `0 ${sp(16)}px`, display: 'flex', flexDirection: 'column', gap: sp(10) }}>
              {later.map(p => (
                <PotRow key={p.containerId} item={p} compact onWater={handleWater} autoPlanned={autoPlanned} />
              ))}
            </div>
          </>
        )}

        {/* 7-Tage Vorschau */}
        <SectionHead label="7 Tage" />
        <div style={{ padding: `0 ${sp(16)}px ${sp(20)}px` }}>
          <WeekBars bars={barDays} />
        </div>

      </div>

      <TabBar active="giessen" onNavigate={onNavigate} />
    </div>
  )
}
