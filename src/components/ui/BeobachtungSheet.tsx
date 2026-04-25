import { useState, useRef, useCallback } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import { IconClose, IconCamera, IconLeaf } from './Icons'
import { uploadImage, askAI } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

type BeobachtungType = 'befall' | 'auffaelligkeit'
type Status = 'idle' | 'processing' | 'done' | 'error'

const LABELS: Record<BeobachtungType, { title: string; emoji: string; placeholder: string }> = {
  befall:        { title: 'Schädlingsbefall melden', emoji: '🐛', placeholder: 'Was hast du beobachtet? Z.B. Gespinste, Löcher in Blättern, Verfärbungen…' },
  auffaelligkeit:{ title: 'Auffälligkeit melden',    emoji: '⚠️', placeholder: 'Was ist aufgefallen? Z.B. gelbe Blätter, welke Triebe, ungewöhnliches Wachstum…' },
}

interface Props {
  type: BeobachtungType
  plantName: string
  onClose: () => void
}

export default function BeobachtungSheet({ type, plantName, onClose }: Props) {
  const meta = LABELS[type]

  const [preview,  setPreview]  = useState<string | null>(null)
  const [text,     setText]     = useState('')
  const [status,   setStatus]   = useState<Status>('idle')
  const [result,   setResult]   = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileRef      = useRef<File | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    fileRef.current = file
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
  }, [preview])

  const handleSubmit = useCallback(async () => {
    if ((!text.trim() && !fileRef.current) || status === 'processing') return
    setStatus('processing')
    setErrorMsg('')
    try {
      let imageBase64: string | undefined
      if (fileRef.current) {
        const uploaded = await uploadImage(fileRef.current)
        imageBase64 = uploaded.base64
      }
      const typeLabel = type === 'befall' ? 'Schädlingsbefall' : 'Auffälligkeit'
      const response = await askAI({
        prompt:       `${typeLabel} bei ${plantName}: ${text || '(kein Beschreibungstext, nur Foto)'}`,
        systemPrompt: 'Du bist ein Pflanzenexperte. Analysiere die beschriebene oder abgebildete Auffälligkeit, benenne die wahrscheinliche Ursache und empfehle konkrete Gegenmassnahmen. Antworte auf Deutsch, max. 4 Sätze.',
        imageBase64,
      })
      setResult(response.text)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler')
      setStatus('error')
    }
  }, [text, status, type, plantName])

  const canSubmit   = (text.trim().length > 0 || preview !== null) && status !== 'processing'
  const isProcessing = status === 'processing'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

      {/* Sheet */}
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
          padding: `${sp(6)}px ${sp(20)}px ${sp(14)}px`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15 }}>{meta.emoji}</span>
              <span style={{ fontSize: fs(17), fontWeight: TYPE.weight.bold, color: V.text, fontFamily: TYPE.fontDisplay }}>
                {meta.title}
              </span>
            </div>
            <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2) }}>
              {plantName} · KI-Analyse
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 16,
              border: 'none', background: V.chipBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <IconClose color={V.text} size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${sp(20)}px ${sp(36)}px` }}>

          {/* Optional photo */}
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            style={{
              width: '100%', height: preview ? 160 : 100,
              borderRadius: r(14),
              border: `2px dashed ${preview ? 'transparent' : V.borderStrong}`,
              background: preview ? 'transparent' : V.chipBg,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: sp(6), cursor: isProcessing ? 'default' : 'pointer',
              overflow: 'hidden', position: 'relative',
              marginBottom: sp(12), transition: 'height .2s',
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Beobachtung"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: r(12) }}
                />
                {isProcessing && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: r(12),
                  }}>
                    <div className="spin" style={{
                      width: 28, height: 28,
                      border: '3px solid rgba(255,255,255,0.25)',
                      borderTopColor: '#fff', borderRadius: 14,
                    }} />
                  </div>
                )}
              </>
            ) : (
              <>
                <IconCamera color={V.textMuted} size={20} />
                <span style={{ fontSize: fs(11.5), color: V.textMuted }}>Optionales Foto</span>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {preview && !isProcessing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ textAlign: 'center', fontSize: fs(11.5), color: V.accent, cursor: 'pointer', marginBottom: sp(12) }}
            >
              Anderes Foto wählen
            </div>
          )}

          {/* Text input */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={meta.placeholder}
            disabled={isProcessing}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: `${sp(12)}px ${sp(14)}px`,
              borderRadius: r(12),
              border: `1px solid ${V.border}`,
              background: V.chipBg,
              fontSize: fs(13), color: V.text,
              resize: 'none', outline: 'none',
              fontFamily: TYPE.fontSans,
              lineHeight: 1.5,
              marginBottom: sp(14),
            }}
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: '100%', padding: `${sp(14)}px`,
              borderRadius: r(14), border: 'none',
              background: canSubmit ? V.warn : V.borderStrong,
              color: canSubmit ? '#fff' : V.textMuted,
              fontSize: fs(14), fontWeight: TYPE.weight.semibold,
              cursor: canSubmit ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'background .15s',
              marginBottom: sp(18),
            }}
          >
            {isProcessing ? (
              <>
                <div className="spin" style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: 7,
                }} />
                Analysiere…
              </>
            ) : (
              `${meta.emoji} Analysieren`
            )}
          </button>

          {/* Result */}
          {status === 'done' && result && (
            <div style={{
              padding: `${sp(14)}px ${sp(16)}px`,
              borderRadius: r(14),
              background: V.warnSoft,
              border: `1px solid ${V.warn}28`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: sp(8) }}>
                <IconLeaf color={V.warn} size={13} />
                <span style={{
                  fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
                  color: V.warn, textTransform: 'uppercase',
                  letterSpacing: TYPE.tracking.section,
                }}>KI-Einschätzung</span>
              </div>
              <p style={{ margin: 0, fontSize: fs(13), lineHeight: 1.6, color: V.text }}>{result}</p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{
              padding: `${sp(12)}px ${sp(14)}px`,
              borderRadius: r(12),
              background: V.warnSoft,
              border: `1px solid ${V.warn}33`,
              fontSize: fs(12.5), color: V.text, lineHeight: 1.45,
            }}>
              <strong style={{ display: 'block', marginBottom: sp(4) }}>Verbindungsfehler</strong>
              {errorMsg || 'Server nicht erreichbar. Ist `npm run dev` gestartet?'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
