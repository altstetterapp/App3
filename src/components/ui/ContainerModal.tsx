import { useState, useRef, useCallback, type FormEvent } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import type { ContainerData } from '../../types'
import { IconClose, IconCamera } from './Icons'
import { uploadImage } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

type Mode = 'create' | 'edit'

interface Props {
  mode: Mode
  container?: ContainerData
  onClose: () => void
  onSave: (data: Omit<ContainerData, 'id' | 'plants' | 'history'>) => void
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

export default function ContainerModal({ mode, container, onClose, onSave }: Props) {
  const [name,       setName]       = useState(container?.name ?? '')
  const [irrigated,  setIrrigated]  = useState(container?.irrigated ?? false)
  const [mlPerWeek,  setMlPerWeek]  = useState(String(container?.mlPerWeek ?? 500))
  const [preview,    setPreview]    = useState<string | null>(
    container?.photoBase64 ? `data:image/jpeg;base64,${container.photoBase64}` : null
  )
  const [photoB64,   setPhotoB64]   = useState(container?.photoBase64)
  const [imgUrl,     setImgUrl]     = useState(container?.imgUrl ?? '')
  const [uploading,  setUploading]  = useState(false)
  const [nameErr,    setNameErr]    = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const res = await uploadImage(file)
      setPhotoB64(res.base64)
      setImgUrl('')
    } catch { /* server may not be running */ }
    finally { setUploading(false) }
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setNameErr(true); return }
    onSave({
      name: name.trim(),
      imgUrl:      imgUrl || container?.imgUrl || '',
      photoBase64: photoB64,
      irrigated,
      mlPerWeek:   irrigated ? Number(mlPerWeek) || 500 : undefined,
      water:       container?.water ?? { status: 'ok', label: 'Noch nicht gegossen' },
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
        maxHeight: '90%', overflow: 'hidden',
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
          <span style={{ fontSize: fs(17), fontWeight: TYPE.weight.bold, color: V.text, fontFamily: TYPE.fontDisplay }}>
            {mode === 'create' ? 'Neuer Container' : 'Container bearbeiten'}
          </span>
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
          <div style={{ marginBottom: sp(20) }}>
            <FieldLabel label="Foto (optional)" />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%', height: 120, borderRadius: r(14),
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
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: r(12),
                    }}>
                      <div className="spin" style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 12 }} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <IconCamera color={V.textMuted} size={22} />
                  <span style={{ fontSize: fs(13), color: V.textMuted }}>Foto wählen</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          {/* Name */}
          <div style={{ marginBottom: sp(18) }}>
            <FieldLabel label="Name" />
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameErr(false) }}
              placeholder="z.B. Beeren-Kiste"
              style={inputStyle(nameErr)}
            />
            {nameErr && <div style={{ fontSize: fs(11.5), color: V.danger, marginTop: sp(4) }}>Name ist erforderlich</div>}
          </div>

          {/* Irrigated toggle */}
          <div style={{ marginBottom: sp(18) }}>
            <FieldLabel label="Bewässerung" />
            <div
              onClick={() => setIrrigated(v => !v)}
              style={{
                padding: `${sp(14)}px ${sp(16)}px`,
                borderRadius: r(12), border: `1px solid ${irrigated ? V.water + '44' : V.border}`,
                background: irrigated ? V.waterSoft : V.chipBg,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: fs(13), fontWeight: TYPE.weight.medium, color: V.text }}>Automatisch bewässert</div>
                <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2) }}>Tropfschlauch oder Timer</div>
              </div>
              {/* Toggle pill */}
              <div style={{
                width: 44, height: 26, borderRadius: 13,
                background: irrigated ? V.water : V.borderStrong,
                position: 'relative', transition: 'background .2s', flexShrink: 0,
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: irrigated ? 21 : 3,
                  width: 20, height: 20, borderRadius: 10,
                  background: '#fff', transition: 'left .2s',
                }} />
              </div>
            </div>
          </div>

          {/* ml/week — only shown when irrigated */}
          {irrigated && (
            <div style={{ marginBottom: sp(18) }}>
              <FieldLabel label="ml / Woche" />
              <div style={{ display: 'flex', alignItems: 'center', gap: sp(8) }}>
                <input
                  type="number"
                  value={mlPerWeek}
                  onChange={e => setMlPerWeek(e.target.value)}
                  min={50} max={5000} step={50}
                  style={{ ...inputStyle(), flex: 1 }}
                />
                <span style={{ fontSize: fs(13), color: V.textMuted, flexShrink: 0 }}>ml</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: '100%', padding: `${sp(14)}px`, marginTop: sp(4),
              borderRadius: r(14), border: 'none',
              background: V.text, color: V.bg,
              fontSize: fs(14), fontWeight: TYPE.weight.semibold, cursor: 'pointer',
            }}
          >
            {mode === 'create' ? 'Container erstellen' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
