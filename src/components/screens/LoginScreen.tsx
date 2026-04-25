import { useState, type FormEvent } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import { authenticate } from '../../lib/api'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

interface Props {
  onSuccess: () => void
}

export default function LoginScreen({ onSuccess }: Props) {
  const [password, setPassword] = useState('')
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password || status === 'loading') return
    setStatus('loading')
    setErrorMsg('')
    try {
      await authenticate(password)
      localStorage.setItem('rp_auth', '1')
      onSuccess()
    } catch {
      setErrorMsg('Falsches Passwort')
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: V.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: TYPE.fontSans, padding: `0 ${sp(32)}px`,
      gap: 0,
    }}>
      {/* Logo mark */}
      <div style={{
        width: 72, height: 72, borderRadius: r(20),
        background: V.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: sp(20),
        boxShadow: '0 12px 30px -8px rgba(43,31,22,0.35)',
      }}>
        <span style={{ fontSize: 34 }}>🌿</span>
      </div>

      {/* Title */}
      <h1 style={{
        margin: 0,
        fontSize: fs(28), fontWeight: TYPE.weight.bold,
        letterSpacing: -0.8, fontFamily: TYPE.fontDisplay,
        color: V.text, textAlign: 'center',
      }}>
        Rooftop Planner
      </h1>
      <p style={{
        margin: `${sp(6)}px 0 ${sp(40)}px`,
        fontSize: fs(13), color: V.textMuted, textAlign: 'center',
      }}>
        Dachgarten verwalten
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setStatus('idle'); setErrorMsg('') }}
          placeholder="Passwort"
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: `${sp(14)}px ${sp(16)}px`,
            borderRadius: r(14),
            border: `1px solid ${status === 'error' ? V.danger : V.borderStrong}`,
            background: V.chipBg,
            fontSize: fs(15), color: V.text,
            outline: 'none', fontFamily: TYPE.fontSans,
            marginBottom: sp(10),
          }}
        />

        {errorMsg && (
          <div style={{
            fontSize: fs(12.5), color: V.danger,
            textAlign: 'center', marginBottom: sp(10),
          }}>
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={!password || status === 'loading'}
          style={{
            width: '100%', padding: `${sp(14)}px`,
            borderRadius: r(14), border: 'none',
            background: password && status !== 'loading' ? V.text : V.borderStrong,
            color: password && status !== 'loading' ? V.bg : V.textMuted,
            fontSize: fs(15), fontWeight: TYPE.weight.semibold,
            cursor: password && status !== 'loading' ? 'pointer' : 'default',
            transition: 'background .15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {status === 'loading' ? (
            <>
              <div className="spin" style={{
                width: 16, height: 16,
                border: `2px solid rgba(255,255,255,0.3)`,
                borderTopColor: '#fff', borderRadius: 8,
              }} />
              Anmelden…
            </>
          ) : 'Anmelden'}
        </button>
      </form>

      {/* Hint */}
      <p style={{
        marginTop: sp(24), fontSize: fs(11),
        color: V.textMuted, textAlign: 'center', lineHeight: 1.5,
      }}>
        Lokales Passwort aus <code style={{ background: V.chipBg, padding: '1px 4px', borderRadius: 4 }}>.env</code>
      </p>
    </div>
  )
}
