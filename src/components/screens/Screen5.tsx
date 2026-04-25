import { useState, useMemo } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import type { NavProps, WeatherDay, WateringEvent, FertilizingEvent } from '../../types'
import { useApp } from '../../context/AppContext'
import { useWeather } from '../../hooks/useWeather'
import { WEATHER as MOCK_WEATHER } from '../../data/mockData'
import StatusBar from '../ui/StatusBar'
import TabBar from '../ui/TabBar'
import { IconChevronLeft, IconChevronRight } from '../ui/Icons'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const DE_MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']
const DE_DAYS   = ['Mo','Di','Mi','Do','Fr','Sa','So']

// ─── Helpers ──────────────────────────────────────────────────

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDow   = new Date(year, month, 1).getDay()     // 0 = Sun
  const startOffset = firstDow === 0 ? 6 : firstDow - 1   // Mon = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  while (grid.length % 7 !== 0) grid.push(null)
  return grid
}

function toISO(year: number, month0: number, day: number) {
  return `${year}-${String(month0 + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function buildWeatherMap(days: WeatherDay[], year: number): Record<string, WeatherDay> {
  const map: Record<string, WeatherDay> = {}
  for (const w of days) {
    const [d, m] = w.date.split('.').map(Number)
    map[`${year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`] = w
  }
  return map
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)}. ${DE_MONTHS[parseInt(m) - 1]} ${y}`
}

function fmtDateShort(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${parseInt(d)}. ${DE_MONTHS[parseInt(m) - 1]}`
}

// ─── Day icons logic ──────────────────────────────────────────

interface DayMeta {
  icons: string[]
  isToday: boolean
  isPast: boolean
  hasFrost: boolean
}

function getDayMeta(
  day: number,
  year: number,
  month0: number,
  todayStr: string,
  weatherMap: Record<string, WeatherDay>,
  waterEvents: WateringEvent[],
  fertEvents: FertilizingEvent[],
  harvestPlantExists: boolean,
): DayMeta {
  const iso  = toISO(year, month0, day)
  const icons: string[] = []
  const cmp  = iso.localeCompare(todayStr)
  const isPast   = cmp < 0
  const isToday  = cmp === 0
  const isFuture = cmp > 0
  const w = weatherMap[iso]

  if (isPast || isToday) {
    if (waterEvents.some(e => e.date === iso)) icons.push('💧')
    if (fertEvents.some(e => e.date === iso))  icons.push('🌿')
    if (w && w.precip > 2) icons.push('☂️')
  }
  if (isFuture) {
    if (w && w.tempC < 4) icons.push('❄️')
    if (w && w.precip > 2) icons.push('☂️')
    const daysAhead = Math.ceil((new Date(iso).getTime() - new Date(todayStr).getTime()) / 86400000)
    if (harvestPlantExists && daysAhead <= 14) icons.push('🌾')
  }
  return { icons, isToday, isPast, hasFrost: !!(w && w.tempC < 4) }
}

// ─── Sub-components ───────────────────────────────────────────

function DayCell({
  day, meta, isSelected, onClick,
}: {
  day: number | null
  meta: DayMeta | null
  isSelected: boolean
  onClick: () => void
}) {
  if (!day || !meta) {
    return <div style={{ flex: 1, height: 60 }} />
  }

  const { icons, isToday, isPast } = meta

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, height: 60, minWidth: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        paddingTop: 5, cursor: 'pointer',
        borderRadius: r(8),
        background: isSelected && !isToday ? V.accentSoft : 'transparent',
        transition: 'background .12s',
      }}
    >
      {/* Day number */}
      <div style={{
        width: 27, height: 27, borderRadius: 14,
        background: isToday ? V.text : isSelected ? V.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: fs(12.5),
          fontWeight: isToday || isSelected ? TYPE.weight.bold : TYPE.weight.regular,
          color: isToday || isSelected ? (isToday ? V.bg : '#fff') : isPast ? V.textMuted : V.text,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {day}
        </span>
      </div>

      {/* Icons */}
      {icons.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: 1, marginTop: 3, lineHeight: 1, maxWidth: '100%',
        }}>
          {icons.slice(0, 4).map((ic, i) => (
            <span key={i} style={{ fontSize: 9 }}>{ic}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Event row in detail panel ────────────────────────────────

function EventRow({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: sp(10),
      padding: `${sp(10)}px ${sp(14)}px`,
      borderBottom: `1px solid ${V.border}`,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: fs(13), fontWeight: TYPE.weight.medium, color: V.text }}>{title}</div>
        {sub && <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2) }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── Screen 5 ─────────────────────────────────────────────────

export default function Screen5({ onNavigate }: NavProps) {
  const { containers, wateringEvents, fertilizingEvents } = useApp()
  const { days: apiDays } = useWeather()
  const weatherDays = apiDays.length > 0 ? apiDays : MOCK_WEATHER

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const [viewYear,  setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())   // 0-indexed
  const [selDay,    setSelDay]    = useState<number | null>(now.getDate())
  const [filterCid, setFilterCid] = useState<string | null>(null)

  // Build weather map for viewed year
  const weatherMap = useMemo(
    () => buildWeatherMap(weatherDays, viewYear),
    [weatherDays, viewYear],
  )

  // Filter events by container
  const filteredWater = useMemo(
    () => filterCid ? wateringEvents.filter(e => e.containerId === filterCid) : wateringEvents,
    [wateringEvents, filterCid],
  )
  const filteredFert  = useMemo(
    () => filterCid ? fertilizingEvents.filter(e => e.containerId === filterCid) : fertilizingEvents,
    [fertilizingEvents, filterCid],
  )

  // Check if any (filtered) plant is in harvest stage
  const harvestPlantExists = useMemo(() => {
    const plants = filterCid
      ? (containers.find(c => c.id === filterCid)?.plants ?? [])
      : containers.flatMap(c => c.plants)
    return plants.some(p => ['Ernte', 'Fruchtbildung'].includes(p.stage))
  }, [containers, filterCid])

  // Calendar grid
  const grid = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  // Metadata for each day (memoised)
  const dayMetaMap = useMemo(() => {
    const map: Record<number, DayMeta> = {}
    const days = new Set(grid.filter(Boolean) as number[])
    for (const day of days) {
      map[day] = getDayMeta(
        day, viewYear, viewMonth, todayStr,
        weatherMap, filteredWater, filteredFert, harvestPlantExists,
      )
    }
    return map
  }, [grid, viewYear, viewMonth, todayStr, weatherMap, filteredWater, filteredFert, harvestPlantExists])

  // Selected day ISO string
  const selIso = selDay ? toISO(viewYear, viewMonth, selDay) : null

  // Events for selected day
  const selWater = selIso ? filteredWater.filter(e => e.date === selIso) : []
  const selFert  = selIso ? filteredFert.filter(e => e.date === selIso) : []
  const selWeather = selIso ? weatherMap[selIso] : null
  const isSelToday = selIso === todayStr
  const isSelFuture = selIso ? selIso > todayStr : false

  // Today's action items (plants needing water)
  const shownContainers = filterCid ? containers.filter(c => c.id === filterCid) : containers
  const overduePlants = shownContainers.filter(c => c.water.status === 'due').flatMap(c => c.plants)
  const duePlants     = shownContainers.filter(c => c.water.status === 'warn').flatMap(c => c.plants)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setSelDay(null)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setSelDay(null)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: V.bg, fontFamily: TYPE.fontSans, color: V.text,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        height: 54, padding: `${sp(6)}px ${sp(16)}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, borderBottom: `1px solid ${V.border}`,
      }}>
        <button onClick={prevMonth} style={{
          width: 34, height: 34, borderRadius: 17,
          border: `1px solid ${V.border}`, background: V.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <IconChevronLeft color={V.text} size={17} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: fs(16), fontWeight: TYPE.weight.bold, letterSpacing: -0.3, fontFamily: TYPE.fontDisplay, color: V.text }}>
            {DE_MONTHS[viewMonth]}
          </div>
          <div style={{ fontSize: fs(11), color: V.textMuted }}>{viewYear}</div>
        </div>

        <button onClick={nextMonth} style={{
          width: 34, height: 34, borderRadius: 17,
          border: `1px solid ${V.border}`, background: V.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <IconChevronRight color={V.text} size={17} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>

        {/* Day-of-week headers */}
        <div style={{
          display: 'flex', padding: `${sp(10)}px ${sp(8)}px ${sp(4)}px`,
          borderBottom: `1px solid ${V.border}`,
        }}>
          {DE_DAYS.map(d => (
            <div key={d} style={{
              flex: 1, textAlign: 'center',
              fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
              color: d === 'Sa' || d === 'So' ? V.accent : V.textMuted,
              letterSpacing: 0.2,
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ padding: `${sp(4)}px ${sp(8)}px` }}>
          {Array.from({ length: grid.length / 7 }, (_, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex' }}>
              {grid.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => (
                <DayCell
                  key={colIdx}
                  day={day}
                  meta={day ? (dayMetaMap[day] ?? null) : null}
                  isSelected={day !== null && day === selDay}
                  onClick={() => { if (day) setSelDay(day) }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          padding: `${sp(8)}px ${sp(16)}px`,
          display: 'flex', flexWrap: 'wrap', gap: `${sp(4)}px ${sp(12)}px`,
          borderTop: `1px solid ${V.border}`,
          borderBottom: `1px solid ${V.border}`,
        }}>
          {[
            { ic: '💧', label: 'Gegossen' },
            { ic: '🌿', label: 'Gedüngt' },
            { ic: '☂️', label: 'Regen >2mm' },
            { ic: '❄️', label: 'Frost' },
            { ic: '🌾', label: 'Erntefenster' },
          ].map(({ ic, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11 }}>{ic}</span>
              <span style={{ fontSize: fs(10.5), color: V.textMuted }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div style={{
          padding: `${sp(12)}px ${sp(16)}px`,
          display: 'flex', gap: sp(8), overflowX: 'auto',
          borderBottom: `1px solid ${V.border}`,
        }}>
          {[{ id: null as string | null, name: 'Alle' }, ...containers.map(c => ({ id: c.id, name: c.name }))].map(({ id, name }) => {
            const active = filterCid === id
            return (
              <button
                key={id ?? 'all'}
                onClick={() => setFilterCid(id)}
                style={{
                  flexShrink: 0,
                  padding: `${sp(6)}px ${sp(12)}px`, borderRadius: 999,
                  border: `1px solid ${active ? V.accent : V.border}`,
                  background: active ? V.accentSoft : V.chipBg,
                  color: active ? V.accent : V.textMuted,
                  fontSize: fs(12), fontWeight: active ? TYPE.weight.semibold : TYPE.weight.medium,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {name}
              </button>
            )
          })}
        </div>

        {/* Selected day detail */}
        <div style={{ paddingTop: sp(4) }}>
          {/* Day title */}
          <div style={{
            padding: `${sp(12)}px ${sp(16)}px ${sp(6)}px`,
            fontSize: fs(12), fontWeight: TYPE.weight.semibold,
            color: V.textMuted, textTransform: 'uppercase', letterSpacing: TYPE.tracking.section,
          }}>
            {selIso ? (isSelToday ? `Heute · ${fmtDateShort(selIso)}` : fmtDate(selIso)) : 'Kein Tag gewählt'}
          </div>

          {/* Today: action items */}
          {isSelToday && (overduePlants.length > 0 || duePlants.length > 0) && (
            <>
              {overduePlants.map(p => (
                <EventRow key={p.id} icon="🔴" title={`${p.name} giessen (überfällig)`} sub={p.water.label} />
              ))}
              {duePlants.map(p => (
                <EventRow key={p.id} icon="🟡" title={`${p.name} giessen`} sub={p.water.label} />
              ))}
            </>
          )}

          {/* Watering events */}
          {selWater.map(e => (
            <EventRow
              key={e.id}
              icon="💧"
              title={`${e.plantName} gegossen`}
              sub={[e.ml ? `${e.ml} ml` : null, containers.find(c => c.id === e.containerId)?.name].filter(Boolean).join(' · ')}
            />
          ))}

          {/* Fertilizing events */}
          {selFert.map(e => (
            <EventRow
              key={e.id}
              icon="🌿"
              title={`${e.plantName} gedüngt`}
              sub={[e.fertilizer, containers.find(c => c.id === e.containerId)?.name].filter(Boolean).join(' · ')}
            />
          ))}

          {/* Weather events */}
          {selWeather && selWeather.precip > 2 && (
            <EventRow
              icon="☂️"
              title={`Regen: ${selWeather.precip} mm`}
              sub={`${selWeather.temp} · ${selWeather.sun} Sonne`}
            />
          )}
          {selWeather && selWeather.tempC < 4 && (
            <EventRow
              icon="❄️"
              title={`Frostgefahr: ${selWeather.temp}`}
              sub="Empfindliche Pflanzen schützen"
            />
          )}

          {/* Future: harvest windows */}
          {isSelFuture && harvestPlantExists && selIso && (() => {
            const daysAhead = Math.ceil((new Date(selIso).getTime() - new Date(todayStr).getTime()) / 86400000)
            if (daysAhead > 14) return null
            const harvestPlants = (filterCid
              ? (containers.find(c => c.id === filterCid)?.plants ?? [])
              : containers.flatMap(c => c.plants)
            ).filter(p => ['Ernte', 'Fruchtbildung'].includes(p.stage))
            return harvestPlants.map(p => (
              <EventRow
                key={p.id}
                icon="🌾"
                title={`${p.name} · Erntefenster`}
                sub={`Stadium: ${p.stage}`}
              />
            ))
          })()}

          {/* Empty state */}
          {selIso && selWater.length === 0 && selFert.length === 0 &&
           !(selWeather?.precip && selWeather.precip > 2) &&
           !(selWeather?.tempC && selWeather.tempC < 4) &&
           !(isSelToday && (overduePlants.length > 0 || duePlants.length > 0)) &&
           !(isSelFuture && harvestPlantExists) && (
            <div style={{
              padding: `${sp(16)}px ${sp(16)}px`,
              fontSize: fs(12.5), color: V.textMuted, textAlign: 'center',
            }}>
              Keine Ereignisse
            </div>
          )}
        </div>
      </div>

      <TabBar active="kalender" onNavigate={onNavigate} />
    </div>
  )
}
