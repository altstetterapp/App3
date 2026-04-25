import { useState, useRef, useCallback } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import { IconClose, IconCamera, IconSparkle, IconLeaf } from './Icons'
import { uploadImage, askAI } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

type Status = 'idle' | 'processing' | 'done' | 'error'

interface Props {
  plantName: string
  onClose: () => void
}

export default function DiagnoseSheet({ plantName, onClose }: Props) {
  const [preview, setPreview]   = useState<string | null>(null)
  const [status, setStatus]     = useState<Status>('idle')
  const [result, setResult]     = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileRef      = useRef<File | null>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    fileRef.current = file
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setStatus('idle')
    setResult('')
    setErrorMsg('')
  }, [preview])

  const handleAnalyze = useCallback(async () => {
    if (!fileRef.current || status === 'processing') return
    setStatus('processing')
    setErrorMsg('')
    try {
      const uploaded = await uploadImage(fileRef.current)
      const response = await askAI({
        prompt:       `Analysiere bitte diese Pflanze (${plantName}) und gib mir eine kurze Einschätzung ihres Gesundheitszustands sowie konkrete Pflegehinweise.`,
        systemPrompt: 'Du bist ein Pflanzenexperte. Antworte auf Deutsch, kurz und praktisch. Maximal 3–4 Sätze.',
        imageBase64:  uploaded.base64,
      })
      setResult(response.text)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler')
      setStatus('error')
    }
  }, [status, plantName])

  const canAnalyze  = preview !== null && status !== 'processing'
  const isProcessing = status === 'processing'

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: V.bg,
        borderTopLeftRadius: r(28), borderTopRightRadius: r(28),
        boxShadow: '0 -12px 40px rgba(43,31,22,0.22)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '92%',
        overflow: 'hidden',
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
              <IconSparkle color={V.accent} size={15} />
              <span style={{ fontSize: fs(17), fontWeight: TYPE.weight.bold, color: V.text, fontFamily: TYPE.fontDisplay }}>
                KI-Analyse
              </span>
            </div>
            <div style={{ fontSize: fs(11.5), color: V.textMuted, marginTop: sp(2) }}>
              {plantName} · Foto analysieren
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

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${sp(20)}px ${sp(36)}px` }}>

          {/* Image tap area */}
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            style={{
              width: '100%', height: 192,
              borderRadius: r(16),
              border: `2px dashed ${preview ? 'transparent' : V.borderStrong}`,
              background: preview ? 'transparent' : V.chipBg,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: sp(8), cursor: isProcessing ? 'default' : 'pointer',
              overflow: 'hidden', position: 'relative',
              marginBottom: sp(10),
            }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Pflanzenfoto"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: r(14) }}
                />
                {isProcessing && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.42)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    borderRadius: r(14), gap: sp(10),
                  }}>
                    <div className="spin" style={{
                      width: 32, height: 32,
                      border: '3px solid rgba(255,255,255,0.25)',
                      borderTopColor: '#fff',
                      borderRadius: 16,
                    }} />
                    <span style={{ color: '#fff', fontSize: fs(12.5), fontWeight: TYPE.weight.medium }}>
                      Analysiere…
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{
                  width: 52, height: 52, borderRadius: 26,
                  background: V.accentSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconCamera color={V.accent} size={24} />
                </div>
                <span style={{ fontSize: fs(13), color: V.text, fontWeight: TYPE.weight.medium }}>
                  Foto wählen
                </span>
                <span style={{ fontSize: fs(11), color: V.textMuted }}>Kamera oder Galerie</span>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Change photo link */}
          {preview && !isProcessing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                textAlign: 'center', fontSize: fs(12), color: V.accent,
                fontWeight: TYPE.weight.medium, cursor: 'pointer',
                marginBottom: sp(14),
              }}
            >
              Anderes Foto wählen
            </div>
          )}

          {/* Analyse CTA */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            style={{
              width: '100%', padding: `${sp(14)}px`,
              borderRadius: r(14), border: 'none',
              background: canAnalyze ? V.accent : V.borderStrong,
              color: canAnalyze ? '#fff' : V.textMuted,
              fontSize: fs(14), fontWeight: TYPE.weight.semibold,
              cursor: canAnalyze ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'background .15s, color .15s',
              marginBottom: sp(18),
            }}
          >
            {isProcessing ? (
              'Analysiere…'
            ) : (
              <>
                <IconSparkle color={canAnalyze ? '#fff' : V.textMuted} size={14} />
                Pflanze analysieren
              </>
            )}
          </button>

          {/* Result */}
          {status === 'done' && result && (
            <div style={{
              padding: `${sp(14)}px ${sp(16)}px`,
              borderRadius: r(14),
              background: V.accentSoft,
              border: `1px solid ${V.accent}28`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                marginBottom: sp(8),
              }}>
                <IconLeaf color={V.accent} size={13} />
                <span style={{
                  fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
                  color: V.accent, textTransform: 'uppercase',
                  letterSpacing: TYPE.tracking.section,
                }}>
                  KI-Einschätzung
                </span>
              </div>
              <p style={{ margin: 0, fontSize: fs(13), lineHeight: 1.6, color: V.text }}>
                {result}
              </p>
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
