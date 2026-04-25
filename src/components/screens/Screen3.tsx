import { useState, useCallback } from 'react'
import { VIBES, DENSITY, TYPE, PHONE } from '../../tokens'
import type { NavProps } from '../../types'
import { useApp, daysSince } from '../../context/AppContext'
import Screen2 from './Screen2'
import { IconDropFill, IconLeaf, IconScissors, IconPlus, IconClose, IconSun, IconThermo, IconSparkle } from '../ui/Icons'
import BeobachtungSheet from '../ui/BeobachtungSheet'
import AuspflanzenPopup from '../ui/AuspflanzenPopup'
import { askAI } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const SHEET_H = Math.round(D.sheetH * PHONE.height)  // 484px

type BeobachtungType = 'befall' | 'auffaelligkeit'
type KiStatus = 'idle' | 'loading' | 'done' | 'error'

interface LogItem { id: number; date: string; title: string; body: string }

const INITIAL_LOG: LogItem[] = [
  { id: 1, date: '22.04.', title: 'Erste Blüten',  body: 'Weisse Knospen an drei Zweigen entdeckt.' },
  { id: 2, date: '19.04.', title: 'Gegossen',       body: '200 ml · Erde war leicht feucht.' },
  { id: 3, date: '14.04.', title: 'Umgetopft',      body: 'In Terrakottatopf mit Kräutererde.' },
]

// ─── Sub-components ───────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: fs(11), fontWeight: TYPE.weight.semibold,
      letterSpacing: TYPE.tracking.section, color: V.textMuted,
      marginBottom: sp(10), textTransform: 'uppercase',
    }}>
      {label}
    </div>
  )
}

function StatTile({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      padding: `${sp(9)}px ${sp(10)}px`, borderRadius: r(12),
      background: highlight ? V.waterSoft : V.bg,
      border: `1px solid ${highlight ? V.water + '33' : V.border}`,
      flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: fs(10.5), color: V.textMuted, fontWeight: TYPE.weight.medium }}>
        {icon}<span>{label}</span>
      </div>
      <div style={{ fontSize: fs(14), fontWeight: TYPE.weight.bold, marginTop: sp(3), color: highlight ? V.water : V.text }}>
        {value}
      </div>
    </div>
  )
}

function ActionTile({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: `${sp(10)}px ${sp(6)}px`, borderRadius: r(14),
        border: `1px solid ${V.border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: sp(5),
        background: V.bg, cursor: 'pointer', flex: 1,
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 15, background: V.chipBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <span style={{ fontSize: fs(10.5), fontWeight: TYPE.weight.medium, color: V.text }}>{label}</span>
    </div>
  )
}

function MetaRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      padding: `${sp(11)}px ${sp(14)}px`,
      borderBottom: last ? 'none' : `1px solid ${V.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: fs(12.5),
    }}>
      <span style={{ color: V.textMuted }}>{label}</span>
      <span style={{ fontWeight: TYPE.weight.semibold, color: V.text }}>{value}</span>
    </div>
  )
}

// ─── Screen 3 ─────────────────────────────────────────────────

export default function Screen3({ onNavigate }: NavProps) {
  const { containers, activeContainerId, activePlantId, auspflanzen } = useApp()

  const container = containers.find(c => c.id === activeContainerId) ?? containers[0]
  const PLANT     = container?.plants.find(p => p.id === activePlantId) ?? container?.plants[0]

  const [beobachtung,    setBeobachtung]    = useState<BeobachtungType | null>(null)
  const [showAuspflanzen, setShowAuspflanzen] = useState(false)

  const [kiStatus,  setKiStatus]  = useState<KiStatus>('idle')
  const [kiText,    setKiText]    = useState('')
  const [kiError,   setKiError]   = useState('')

  const [log, setLog] = useState<LogItem[]>(INITIAL_LOG)

  const plantName = PLANT?.name ?? 'Unbekannte Pflanze'
  const plantSub  = PLANT?.sub ?? ''
  const plantDays = PLANT ? daysSince(PLANT.plantedDate) : 0
  const imgSrc    = PLANT?.photoBase64
    ? `data:image/jpeg;base64,${PLANT.photoBase64}`
    : (PLANT?.imgUrl ?? '')

  const handleKiProfil = useCallback(async () => {
    if (kiStatus === 'loading') return
    setKiStatus('loading')
    setKiError('')
    try {
      const res = await askAI({
        prompt:       `Erstelle ein detailliertes KI-Pflegeprofil für ${plantName} (${plantSub}). Strukturiere die Antwort in exakt 5 Abschnitte: Einpflanzen, Pflegetipps, Düngen, Ernte, Überwinterung.`,
        systemPrompt: 'Du bist ein Pflanzenexperte. Gib für jeden Abschnitt 2–3 prägnante Sätze. Format: Abschnittsname auf einer eigenen Zeile, dann der Text, Abschnitte durch eine Leerzeile getrennt. Antworte auf Deutsch.',
      })
      setKiText(res.text)
      setKiStatus('done')
    } catch (err) {
      setKiError(err instanceof Error ? err.message : 'Fehler')
      setKiStatus('error')
    }
  }, [kiStatus, plantName, plantSub])

  const kiSections = kiText
    ? kiText.split('\n\n').map(block => {
        const nl = block.indexOf('\n')
        if (nl === -1) return { title: '', body: block }
        return { title: block.slice(0, nl), body: block.slice(nl + 1) }
      })
    : []

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>

      {/* Dimmed Screen2 background */}
      <div style={{ position: 'absolute', inset: 0, filter: 'brightness(0.55)', pointerEvents: 'none' }}>
        <Screen2 onNavigate={() => {}} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.22)', pointerEvents: 'none' }} />

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: SHEET_H,
        background: V.bg,
        borderTopLeftRadius: r(28), borderTopRightRadius: r(28),
        boxShadow: '0 -10px 30px rgba(43,31,22,0.14)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: `${sp(10)}px 0 ${sp(4)}px`, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: V.borderStrong }} />
        </div>

        {/* Sheet header */}
        <div style={{
          padding: `${sp(6)}px ${sp(20)}px ${sp(10)}px`,
          display: 'flex', alignItems: 'center', gap: sp(12),
          flexShrink: 0,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: r(14),
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            flexShrink: 0, border: `1px solid ${V.border}`,
            backgroundColor: V.accentSoft,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: fs(19), fontWeight: TYPE.weight.bold, letterSpacing: -0.4, fontFamily: TYPE.fontDisplay, color: V.text }}>
              {plantName}
            </div>
            <div style={{ fontSize: fs(11.5), color: V.textMuted, fontStyle: 'italic' }}>{plantSub}</div>
            <div style={{
              marginTop: sp(6), display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: `${sp(2)}px ${sp(8)}px`, borderRadius: 999,
              background: V.accentSoft, color: V.accent,
              fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
            }}>
              <IconLeaf color={V.accent} size={10} /> {PLANT?.stage ?? '—'} · Tag {plantDays}
            </div>
          </div>
          <button
            onClick={() => onNavigate('container-detail')}
            style={{
              width: 32, height: 32, borderRadius: 16,
              border: 'none', background: V.chipBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <IconClose color={V.text} size={15} />
          </button>
        </div>

        {/* Stat tiles */}
        <div style={{ padding: `${sp(6)}px ${sp(16)}px ${sp(10)}px`, display: 'flex', gap: sp(8), flexShrink: 0 }}>
          <StatTile icon={<IconDropFill color={V.water} size={14} />} label="Heute" value="Giessen" highlight />
          <StatTile icon={<IconSun color="#c05a2a" size={14} />}      label="Sonne" value="Voll" />
          <StatTile icon={<IconThermo color={V.text} size={14} />}    label="Temp." value="22°" />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `${sp(6)}px ${sp(20)}px ${sp(24)}px` }}>

          {/* Watering callout */}
          <div style={{
            padding: `${sp(12)}px ${sp(14)}px`, borderRadius: r(14),
            background: V.warnSoft, border: `1px solid ${V.warn}22`,
            display: 'flex', alignItems: 'center', gap: sp(10), marginBottom: sp(18),
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: V.warn,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <IconDropFill color="#fff" size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: fs(13), fontWeight: TYPE.weight.semibold, color: V.text }}>Heute giessen</div>
              <div style={{ fontSize: fs(11), color: V.textMuted }}>Ca. 200 ml · Erde fühlt sich trocken an</div>
            </div>
            <button style={{
              padding: `${sp(7)}px ${sp(12)}px`, borderRadius: r(10),
              background: V.warn, color: '#fff', border: 'none',
              fontWeight: TYPE.weight.semibold, fontSize: fs(11.5), cursor: 'pointer',
              flexShrink: 0,
            }}>Giessen</button>
          </div>

          {/* ── Aktionen ── */}
          <SectionLabel label="Aktionen" />
          <div style={{ display: 'flex', gap: sp(8), marginBottom: sp(22) }}>
            <ActionTile icon={<IconDropFill color={V.water}  size={16} />} label="Giessen" />
            <ActionTile icon={<IconLeaf     color={V.accent} size={16} />} label="Düngen" />
            <ActionTile icon={<IconScissors color={V.text}   size={16} />} label="Schnitt" />
            <ActionTile icon={<IconPlus     color={V.text}   size={16} />} label="Notiz" />
          </div>

          {/* ── Pflege ── */}
          <SectionLabel label="Pflege" />
          <div style={{ border: `1px solid ${V.border}`, borderRadius: r(14), overflow: 'hidden', marginBottom: sp(22) }}>
            <MetaRow label="Giessintervall"  value="Alle 1–2 Tage" />
            <MetaRow label="Letztes Giessen" value="Vorgestern, 18:40" />
            <MetaRow label="Sonnenbedarf"    value="Vollsonne · 6–8 h" />
            <MetaRow label="Gepflanzt am"    value="14. März 2026" last />
          </div>

          {/* ── Auspflanzen ── */}
          <button
            onClick={() => setShowAuspflanzen(true)}
            style={{
              width: '100%', padding: `${sp(12)}px`,
              borderRadius: r(12), marginBottom: sp(22),
              border: `1px solid ${V.border}`, background: V.chipBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              fontSize: fs(13), fontWeight: TYPE.weight.medium,
              color: V.textMuted, cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 14 }}>🌱</span> Auspflanzen
          </button>

          {/* ── Beobachtungen ── */}
          <SectionLabel label="Beobachtungen" />
          <div style={{ display: 'flex', gap: sp(8), marginBottom: sp(22) }}>
            {(['befall', 'auffaelligkeit'] as const).map(t => {
              const emoji = t === 'befall' ? '🐛' : '⚠️'
              const label = t === 'befall' ? 'Befall melden' : 'Auffälligkeit'
              return (
                <button
                  key={t}
                  onClick={() => setBeobachtung(t)}
                  style={{
                    flex: 1, padding: `${sp(11)}px ${sp(8)}px`,
                    borderRadius: r(12),
                    border: `1px solid ${V.border}`,
                    background: V.chipBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontSize: fs(12.5), fontWeight: TYPE.weight.medium,
                    color: V.text, cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{emoji}</span>
                  {label}
                </button>
              )
            })}
          </div>

          {/* ── KI-Profil ── */}
          <SectionLabel label="KI-Profil" />
          <div style={{ marginBottom: sp(22) }}>

            {kiStatus === 'idle' && (
              <button
                onClick={handleKiProfil}
                style={{
                  width: '100%', padding: `${sp(13)}px`,
                  borderRadius: r(14), border: `1px solid ${V.accent}33`,
                  background: V.accentSoft, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  fontSize: fs(13), fontWeight: TYPE.weight.semibold, color: V.accent,
                }}
              >
                <IconSparkle color={V.accent} size={14} />
                KI-Profil generieren
              </button>
            )}

            {kiStatus === 'loading' && (
              <div style={{
                padding: `${sp(16)}px`, borderRadius: r(14),
                background: V.accentSoft, border: `1px solid ${V.accent}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                <div className="spin" style={{
                  width: 16, height: 16,
                  border: `2px solid ${V.accent}33`,
                  borderTopColor: V.accent, borderRadius: 8,
                }} />
                <span style={{ fontSize: fs(12.5), color: V.accent }}>Profil wird generiert…</span>
              </div>
            )}

            {kiStatus === 'done' && kiSections.length > 0 && (
              <div style={{ border: `1px solid ${V.accent}22`, borderRadius: r(14), overflow: 'hidden' }}>
                {kiSections.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: `${sp(11)}px ${sp(14)}px`,
                      borderBottom: i < kiSections.length - 1 ? `1px solid ${V.border}` : 'none',
                      background: i % 2 === 0 ? V.accentSoft : V.bg,
                    }}
                  >
                    {s.title && (
                      <div style={{
                        fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
                        color: V.accent, textTransform: 'uppercase',
                        letterSpacing: TYPE.tracking.section, marginBottom: sp(4),
                      }}>
                        {s.title}
                      </div>
                    )}
                    <div style={{ fontSize: fs(12.5), color: V.text, lineHeight: 1.5 }}>{s.body}</div>
                  </div>
                ))}
                <button
                  onClick={() => { setKiStatus('idle'); setKiText('') }}
                  style={{
                    width: '100%', padding: `${sp(10)}px`,
                    background: 'transparent', border: 'none',
                    borderTop: `1px solid ${V.border}`,
                    fontSize: fs(11.5), color: V.textMuted,
                    cursor: 'pointer',
                  }}
                >
                  Neu generieren
                </button>
              </div>
            )}

            {kiStatus === 'error' && (
              <div style={{
                padding: `${sp(12)}px ${sp(14)}px`, borderRadius: r(12),
                background: V.warnSoft, border: `1px solid ${V.warn}33`,
                fontSize: fs(12), color: V.text,
              }}>
                {kiError || 'Server nicht erreichbar.'}
                <button
                  onClick={() => setKiStatus('idle')}
                  style={{ display: 'block', marginTop: sp(6), background: 'none', border: 'none', color: V.accent, cursor: 'pointer', fontSize: fs(11.5), padding: 0 }}
                >
                  Erneut versuchen
                </button>
              </div>
            )}
          </div>

          {/* ── Protokoll ── */}
          <SectionLabel label="Protokoll" />
          {log.length === 0 ? (
            <div style={{ fontSize: fs(12), color: V.textMuted, textAlign: 'center', padding: `${sp(16)}px` }}>
              Noch keine Einträge
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: sp(12) }}>
              {log.map(entry => (
                <div key={entry.id} style={{ display: 'flex', gap: sp(12), alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: fs(10.5), color: V.textMuted, fontWeight: TYPE.weight.semibold,
                    width: 44, flexShrink: 0, paddingTop: 1, fontVariantNumeric: 'tabular-nums',
                  }}>{entry.date}</div>
                  <div style={{ flex: 1, borderLeft: `1px solid ${V.border}`, paddingLeft: sp(12), paddingBottom: sp(4), position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: -4, top: 5,
                      width: 7, height: 7, borderRadius: 4,
                      background: V.accent, boxShadow: `0 0 0 2px ${V.bg}`,
                    }} />
                    <div style={{ fontSize: fs(12.5), fontWeight: TYPE.weight.semibold, color: V.text }}>{entry.title}</div>
                    <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2), lineHeight: 1.4 }}>{entry.body}</div>
                  </div>
                  <button
                    onClick={() => setLog(prev => prev.filter(e => e.id !== entry.id))}
                    style={{
                      width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                      border: 'none', background: V.chipBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', marginTop: 1, color: V.textMuted,
                      fontSize: 14, lineHeight: 1,
                    }}
                    aria-label="Eintrag löschen"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Beobachtung overlay */}
      {beobachtung && (
        <BeobachtungSheet
          type={beobachtung}
          plantName={plantName}
          onClose={() => setBeobachtung(null)}
        />
      )}

      {/* Auspflanzen popup */}
      {showAuspflanzen && PLANT && (
        <AuspflanzenPopup
          plantName={plantName}
          onClose={() => setShowAuspflanzen(false)}
          onConfirm={date => {
            auspflanzen(container?.id ?? '', PLANT.id, date)
            setShowAuspflanzen(false)
            onNavigate('container-detail')
          }}
        />
      )}
    </div>
  )
}
