import { useState, useRef, useCallback, type FormEvent } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import type { PlantData } from '../../types'
import { IconClose, IconCamera } from './Icons'
import { uploadImage } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const TODAY = new Date().toISOString().slice(0, 10)

const STAGES = ['Setzling', 'Wachstum', 'Blüte', 'Fruchtbildung', 'Ernte', 'Ruhephase']

interface Props {
  containerName: string
  onClose: () => void
  onSave: (data: Omit<PlantData, 'id'>) => void
}

function FieldLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: fs(11), fontWeight: TYPE.weight.semibold,
      letterSpacing: TYPE.tracking.section, color: V.textMuted,
      textTransform: 'uppercase', marginBottom: sp(6),
    }}>{label}</div>
  )
}

const inputStyle = (err?: boolean) => ({
  width: '100%', boxSizing: 'border-box' as const,
  padding: `${sp(12)}px ${sp(14)}px`,
  borderRadius: r(12), border: `1px solid ${err ? V.danger : V.border}`,
  background: V.chipBg, fontSize: fs(14), color: V.text,
  outline: 'none', fontFamily: TYPE.fontSans,
})

export default function PlantModal({ containerName, onClose, onSave }: Props) {
  const [name,        setName]       = useState('')
  const [sub,         setSub]        = useState('')
  const [stage,       setStage]      = useState('Setzling')
  const [plantedDate, setPlantedDate] = useState(TODAY)
  const [preview,     setPreview]    = useState<string | null>(null)
  const [photoB64,    setPhotoB64]   = useState<string | undefined>()
  const [uploading,   setUploading]  = useState(false)
  const [nameErr,     setNameErr]    = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setPhotoB64(res.base64)
    } catch { /* server may not be running */ }
    finally { setUploading(false) }
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameErr(true); return }
    onSave({
      name: name.trim(), sub: sub.trim(), stage,
      plantedDate: plantedDate || TODAY,
      imgUrl: photoB64 ? '' : 'https://images.unsplash.com/photo-1585687433188-12cde1da8dd6?w=600&q=70&auto=format&fit=crop',
      photoBase64: photoB64,
      water: { label: 'Heute giessen', status: 'warn' },
    })
    onClose()
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: V.bg,
        borderTopLeftRadius: r(28), borderTopRightRadius: r(28),
        boxShadow: '0 -12px 40px rgba(43,31,22,0.22)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92%', overflow: 'hidden',
      }}>
        {/* Grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: `${sp(10)}px 0 ${sp(4)}px`, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: V.borderStrong }} />
        </div>

        {/* Header */}
        <div style={{
          padding: `${sp(6)}px ${sp(20)}px ${sp(16)}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: fs(17), fontWeight: TYPE.weight.bold, color: V.text, fontFamily: TYPE.fontDisplay }}>
              Neue Pflanze
            </div>
            <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2) }}>{containerName}</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 16, border: 'none', background: V.chipBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <IconClose color={V.text} size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: `0 ${sp(20)}px ${sp(36)}px` }}>

          {/* Photo */}
          <div style={{ marginBottom: sp(18) }}>
            <FieldLabel label="Foto (optional)" />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%', height: 100, borderRadius: r(14),
                border: `2px dashed ${preview ? 'transparent' : V.borderStrong}`,
                background: preview ? 'transparent' : V.chipBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: sp(8), cursor: 'pointer', overflow: 'hidden', position: 'relative',
              }}
            >
              {preview ? (
                <>
                  <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: r(12) }} />
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: r(12) }}>
                      <div className="spin" style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 12 }} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <IconCamera color={V.textMuted} size={20} />
                  <span style={{ fontSize: fs(12.5), color: V.textMuted }}>Foto wählen</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          {/* Name */}
          <div style={{ marginBottom: sp(16) }}>
            <FieldLabel label="Name *" />
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameErr(false) }}
              placeholder="z.B. Erdbeere"
              style={inputStyle(nameErr)}
            />
            {nameErr && <div style={{ fontSize: fs(11.5), color: V.danger, marginTop: sp(4) }}>Name ist erforderlich</div>}
          </div>

          {/* Botanical name */}
          <div style={{ marginBottom: sp(16) }}>
            <FieldLabel label="Botanischer Name (optional)" />
            <input
              type="text"
              value={sub}
              onChange={e => setSub(e.target.value)}
              placeholder="z.B. Fragaria × ananassa"
              style={inputStyle()}
            />
          </div>

          {/* Stage chips */}
          <div style={{ marginBottom: sp(16) }}>
            <FieldLabel label="Stadium" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: sp(8) }}>
              {STAGES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStage(s)}
                  style={{
                    padding: `${sp(7)}px ${sp(12)}px`, borderRadius: 999,
                    border: `1px solid ${stage === s ? V.accent : V.border}`,
                    background: stage === s ? V.accentSoft : V.bg,
                    color: stage === s ? V.accent : V.textMuted,
                    fontSize: fs(12.5), fontWeight: TYPE.weight.medium, cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Planted date */}
          <div style={{ marginBottom: sp(22) }}>
            <FieldLabel label="Eingepflanzt am" />
            <input
              type="date"
              value={plantedDate}
              onChange={e => setPlantedDate(e.target.value)}
              style={inputStyle()}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: '100%', padding: `${sp(14)}px`,
              borderRadius: r(14), border: 'none',
              background: V.text, color: V.bg,
              fontSize: fs(14), fontWeight: TYPE.weight.semibold, cursor: 'pointer',
            }}
          >
            Pflanze hinzufügen
          </button>
        </form>
      </div>
    </div>
  )
}
