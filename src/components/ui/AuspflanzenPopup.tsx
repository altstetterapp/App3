import { useState, type FormEvent } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const TODAY = new Date().toISOString().slice(0, 10)

interface Props {
  plantName: string
  onConfirm: (date: string) => void
  onClose:   () => void
}

export default function AuspflanzenPopup({ plantName, onConfirm, onClose }: Props) {
  const [date, setDate] = useState(TODAY)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onConfirm(date || TODAY)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: V.bg, borderRadius: r(22),
        boxShadow: '0 20px 60px rgba(43,31,22,0.25)',
        padding: `${sp(24)}px ${sp(24)}px ${sp(20)}px`,
        width: 300,
      }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: r(14),
          background: V.warnSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: sp(14), fontSize: 22,
        }}>
          🌱
        </div>

        <div style={{ fontSize: fs(17), fontWeight: TYPE.weight.bold, color: V.text, fontFamily: TYPE.fontDisplay, marginBottom: sp(6) }}>
          Auspflanzen
        </div>
        <div style={{ fontSize: fs(12.5), color: V.textMuted, marginBottom: sp(20), lineHeight: 1.45 }}>
          <strong>{plantName}</strong> wird ins Protokoll verschoben und aus der aktiven Ansicht entfernt.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            fontSize: fs(11), fontWeight: TYPE.weight.semibold, letterSpacing: TYPE.tracking.section,
            color: V.textMuted, textTransform: 'uppercase', marginBottom: sp(6),
          }}>Datum</div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: `${sp(11)}px ${sp(13)}px`, marginBottom: sp(18),
              borderRadius: r(12), border: `1px solid ${V.border}`,
              background: V.chipBg, fontSize: fs(14), color: V.text,
              outline: 'none', fontFamily: TYPE.fontSans,
            }}
          />

          <div style={{ display: 'flex', gap: sp(10) }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: `${sp(12)}px`,
                borderRadius: r(12), border: `1px solid ${V.border}`,
                background: V.chipBg, color: V.text,
                fontSize: fs(13), fontWeight: TYPE.weight.semibold, cursor: 'pointer',
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              style={{
                flex: 1, padding: `${sp(12)}px`,
                borderRadius: r(12), border: 'none',
                background: V.warn, color: '#fff',
                fontSize: fs(13), fontWeight: TYPE.weight.semibold, cursor: 'pointer',
              }}
            >
              Bestätigen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
