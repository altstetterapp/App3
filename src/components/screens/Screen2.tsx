import { useState } from 'react'
import { VIBES, DENSITY, TYPE } from '../../tokens'
import { useApp, daysSince } from '../../context/AppContext'
import type { PlantData, NavProps } from '../../types'
import StatusBar from '../ui/StatusBar'
import TabBar from '../ui/TabBar'
import ContainerModal from '../ui/ContainerModal'
import PlantModal from '../ui/PlantModal'
import { IconChevronLeft, IconChevronRight, IconDropFill, IconLeaf, IconPlus, IconClose } from '../ui/Icons'

const V = VIBES.terracotta
const D = DENSITY.zen
const sp = (n: number) => Math.round(n * D.spaceMultiplier)
const fs = (n: number) => n * D.fontScale
const r  = (n: number) => Math.round(n * V.radiusMultiplier)

const CARD_W = 210
const CARD_H = D.cardH   // 450 for zen

// ─── Plant card ───────────────────────────────────────────────

function PlantCard({ p }: { p: PlantData }) {
  const warn    = p.water.status === 'warn'
  const waterBg = warn ? V.warnSoft  : V.waterSoft
  const waterFg = warn ? V.warn      : V.water
  const imgSrc  = p.photoBase64 ? `data:image/jpeg;base64,${p.photoBase64}` : p.imgUrl
  const days    = daysSince(p.plantedDate)
  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: r(22), background: V.bg, border: `1px solid ${V.border}`,
      overflow: 'hidden', boxShadow: V.shadow,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        flex: '0 0 62%',
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', backgroundColor: V.accentSoft,
      }}>
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: `${sp(4)}px ${sp(9)}px`, borderRadius: 999,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
          fontSize: fs(10.5), fontWeight: TYPE.weight.semibold,
          display: 'flex', alignItems: 'center', gap: 4, color: V.text,
        }}>
          <IconLeaf color={V.accent} size={10} />{p.stage}
        </div>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}>
          <span style={{ fontSize: fs(13), fontWeight: TYPE.weight.bold, letterSpacing: -0.3, color: V.text }}>{days}</span>
          <span style={{ fontSize: fs(8), color: V.textMuted, marginTop: 1 }}>Tage</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: `${sp(12)}px ${sp(14)}px`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: fs(18), fontWeight: TYPE.weight.bold, letterSpacing: -0.4, fontFamily: TYPE.fontDisplay, color: V.text }}>{p.name}</div>
          <div style={{ fontSize: fs(11), color: V.textMuted, fontStyle: 'italic', marginTop: 1 }}>{p.sub}</div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: `${sp(6)}px ${sp(10)}px`, borderRadius: r(10),
          background: waterBg, color: waterFg,
          fontSize: fs(11), fontWeight: TYPE.weight.semibold, alignSelf: 'flex-start',
        }}>
          <IconDropFill color={waterFg} size={11} />
          {warn ? 'Giessen fällig' : p.water.label}
        </div>
      </div>
    </div>
  )
}

// ─── Arrow button ─────────────────────────────────────────────

function ArrowBtn({ side, disabled, onClick }: { side: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      position: 'absolute',
      [side]: 8,
      top: '50%', transform: 'translateY(-50%)',
      width: 34, height: 34, borderRadius: 17,
      background: V.bg, border: `1px solid ${V.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(90,54,28,0.08)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1, zIndex: 5,
    }}>
      {side === 'left'
        ? <IconChevronLeft  color={disabled ? V.textFaint : V.text} size={18} />
        : <IconChevronRight color={disabled ? V.textFaint : V.text} size={18} />}
    </button>
  )
}

// ─── Screen 2 ─────────────────────────────────────────────────

export default function Screen2({ onNavigate }: NavProps) {
  const {
    containers, activeContainerId, setActiveContainer,
    setActivePlant, updateContainer, deleteContainer,
    addPlant, deleteHistory,
  } = useApp()

  const container = containers.find(c => c.id === activeContainerId) ?? containers[0]
  const plants    = container?.plants ?? []

  const [idx,             setIdx]             = useState(0)
  const [showMenu,        setShowMenu]        = useState(false)
  const [showEditModal,   setShowEditModal]   = useState(false)
  const [showPlantModal,  setShowPlantModal]  = useState(false)

  const safeIdx = Math.min(idx, Math.max(0, plants.length - 1))

  function handleDeleteContainer() {
    setShowMenu(false)
    deleteContainer(container.id)
    onNavigate('garten')
  }

  if (!container) return null

  const imgSrc = container.photoBase64
    ? `data:image/jpeg;base64,${container.photoBase64}`
    : container.imgUrl

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: V.bg, fontFamily: TYPE.fontSans, color: V.text, overflow: 'hidden',
    }}>
      <StatusBar />

      {/* Nav header */}
      <div style={{
        height: 54, padding: `${sp(6)}px ${sp(16)}px ${sp(10)}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, position: 'relative',
      }}>
        <button
          onClick={() => onNavigate('garten')}
          style={{
            width: 36, height: 36, borderRadius: 18,
            border: `1px solid ${V.border}`, background: V.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <IconChevronLeft color={V.text} size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: fs(15), fontWeight: TYPE.weight.semibold, color: V.text }}>{container.name}</div>
          <div style={{ fontSize: fs(11), color: V.textMuted }}>
            {plants.length} {plants.length === 1 ? 'Pflanze' : 'Pflanzen'}
            {container.irrigated ? ' · Bewässert' : ''}
          </div>
        </div>

        {/* Right actions: + and ... */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setShowPlantModal(true)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              border: `1px solid ${V.border}`, background: V.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <IconPlus color={V.text} size={16} />
          </button>
          <button
            onClick={() => setShowMenu(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 18,
              border: `1px solid ${showMenu ? V.accent : V.border}`,
              background: showMenu ? V.accentSoft : V.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <svg width="18" height="4" viewBox="0 0 18 4" fill={V.text}>
              <circle cx="2" cy="2" r="2"/><circle cx="9" cy="2" r="2"/><circle cx="16" cy="2" r="2"/>
            </svg>
          </button>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div onClick={() => setShowMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
            <div style={{
              position: 'absolute', top: 50, right: 16, zIndex: 20,
              background: V.bg, borderRadius: r(14),
              border: `1px solid ${V.border}`,
              boxShadow: '0 8px 24px rgba(43,31,22,0.14)',
              minWidth: 170, overflow: 'hidden',
            }}>
              {[
                { label: 'Bearbeiten', action: () => { setShowMenu(false); setShowEditModal(true) }, color: V.text },
                { label: 'Container löschen', action: handleDeleteContainer, color: V.danger },
              ].map(({ label, action, color }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    display: 'block', width: '100%',
                    padding: `${sp(13)}px ${sp(16)}px`,
                    background: 'none', border: 'none',
                    textAlign: 'left', fontSize: fs(13),
                    fontWeight: TYPE.weight.medium, color,
                    cursor: 'pointer', borderBottom: label === 'Bearbeiten' ? `1px solid ${V.border}` : 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main scrollable area */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0, bottom: 82,
        overflowY: 'auto',
      }}>
        {/* Carousel + sidebar row */}
        <div style={{ height: CARD_H + 48, display: 'flex', position: 'relative' }}>

          {/* Left — card stack */}
          <div style={{
            flex: 1, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: `${sp(20)}px 0 ${sp(8)}px`, overflow: 'hidden',
          }}>
            {plants.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: sp(12),
                color: V.textMuted, textAlign: 'center', padding: sp(24),
              }}>
                <span style={{ fontSize: 36 }}>🌱</span>
                <div style={{ fontSize: fs(13) }}>Noch keine Pflanzen</div>
                <button
                  onClick={() => setShowPlantModal(true)}
                  style={{
                    padding: `${sp(9)}px ${sp(16)}px`, borderRadius: r(12),
                    border: `1px solid ${V.accent}44`, background: V.accentSoft,
                    color: V.accent, fontSize: fs(12.5), fontWeight: TYPE.weight.semibold,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <IconPlus color={V.accent} size={13} /> Pflanze hinzufügen
                </button>
              </div>
            ) : (
              <>
                {/* Pagination dots */}
                <div style={{
                  position: 'absolute', top: sp(6), left: 0, right: 0,
                  display: 'flex', justifyContent: 'center', gap: sp(6), zIndex: 10,
                }}>
                  {plants.map((_, i) => (
                    <div key={i} style={{
                      width: i === safeIdx ? 18 : 6, height: 6, borderRadius: 3,
                      background: i === safeIdx ? V.text : V.border, transition: 'all .2s',
                    }} />
                  ))}
                </div>

                {/* Card stack */}
                <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
                  {plants.map((p, i) => {
                    const offset = i - safeIdx
                    if (Math.abs(offset) > 1) return null
                    const isCurrent = offset === 0
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (isCurrent) {
                            setActivePlant(p.id)
                            onNavigate('plant-profile')
                          } else {
                            setIdx(i)
                          }
                        }}
                        style={{
                          position: 'absolute', inset: 0,
                          transform: `translateX(${isCurrent ? 0 : offset * 175}px) scale(${isCurrent ? 1 : 0.92})`,
                          opacity: isCurrent ? 1 : 0.45,
                          zIndex: isCurrent ? 3 : 1,
                          transition: 'transform .35s cubic-bezier(.2,.8,.3,1), opacity .3s',
                          cursor: 'pointer',
                        }}
                      >
                        <PlantCard p={p} />
                      </div>
                    )
                  })}
                </div>

                <ArrowBtn side="left"  disabled={safeIdx === 0}               onClick={() => setIdx(i => i - 1)} />
                <ArrowBtn side="right" disabled={safeIdx === plants.length - 1} onClick={() => setIdx(i => i + 1)} />
              </>
            )}
          </div>

          {/* Right — watering sidebar */}
          {plants.length > 0 && (
            <div style={{
              width: 88, borderLeft: `1px solid ${V.border}`,
              padding: `${sp(8)}px ${sp(10)}px`,
              display: 'flex', flexDirection: 'column', gap: sp(10),
            }}>
              <div style={{
                fontSize: fs(9.5), fontWeight: TYPE.weight.bold,
                letterSpacing: TYPE.tracking.section, color: V.textMuted,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <IconDropFill color={V.water} size={10} /> GIESSEN
              </div>

              {plants.map((p, i) => {
                const warn   = p.water.status === 'warn'
                const active = i === safeIdx
                return (
                  <div key={p.id} onClick={() => setIdx(i)} style={{
                    borderRadius: r(12), padding: `${sp(9)}px ${sp(8)}px`,
                    background: active ? V.chipBg : 'transparent',
                    border: `1px solid ${active ? V.border : 'transparent'}`,
                    cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: fs(11), fontWeight: TYPE.weight.semibold, color: V.text, lineHeight: 1.15 }}>{p.name}</div>
                    <div style={{ marginTop: sp(4), fontSize: fs(9.5), fontWeight: TYPE.weight.medium, color: warn ? V.warn : V.textMuted }}>
                      {p.water.label}
                    </div>
                    <div style={{
                      marginTop: sp(8), width: 26, height: 26, borderRadius: 13,
                      background: warn ? V.warn : V.waterSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconDropFill color={warn ? '#fff' : V.water} size={13} />
                    </div>
                  </div>
                )
              })}

              <div style={{ flex: 1 }} />

              <button
                onClick={() => setShowPlantModal(true)}
                style={{
                  padding: `${sp(10)}px ${sp(6)}px`, borderRadius: r(12),
                  border: `1px solid ${V.border}`, background: V.bg,
                  fontSize: fs(10.5), fontWeight: TYPE.weight.semibold, color: V.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  cursor: 'pointer',
                }}
              >
                <IconPlus color={V.text} size={12} /> Neu
              </button>
            </div>
          )}
        </div>

        {/* Container photo strip */}
        {(container.photoBase64 || container.imgUrl) && (
          <div style={{ padding: `0 ${sp(16)}px ${sp(4)}px` }}>
            <div style={{
              height: 60, borderRadius: r(14),
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              border: `1px solid ${V.border}`, opacity: 0.6,
            }} />
          </div>
        )}

        {/* History section */}
        {container.history.length > 0 && (
          <div style={{ padding: `${sp(16)}px ${sp(20)}px ${sp(32)}px` }}>
            <div style={{
              fontSize: fs(11), fontWeight: TYPE.weight.semibold,
              letterSpacing: TYPE.tracking.section, color: V.textMuted,
              textTransform: 'uppercase', marginBottom: sp(12),
            }}>
              Ehemalige Pflanzen
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: sp(8) }}>
              {container.history.map(h => (
                <div key={h.id} style={{
                  display: 'flex', alignItems: 'center', gap: sp(12),
                  padding: `${sp(11)}px ${sp(14)}px`,
                  borderRadius: r(14), border: `1px solid ${V.border}`, background: V.bg,
                }}>
                  {h.imgUrl && (
                    <div style={{
                      width: 40, height: 40, borderRadius: r(10), flexShrink: 0,
                      backgroundImage: `url(${h.imgUrl})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      backgroundColor: V.accentSoft,
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: fs(13), fontWeight: TYPE.weight.semibold, color: V.text }}>{h.plantName}</div>
                    {h.sub && <div style={{ fontSize: fs(11), color: V.textMuted, fontStyle: 'italic' }}>{h.sub}</div>}
                    <div style={{ fontSize: fs(11), color: V.textMuted, marginTop: sp(2) }}>
                      Ausgepflanzt am {h.auspflanzDate.split('-').reverse().join('.')}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHistory(container.id, h.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                      border: `1px solid ${V.border}`, background: V.chipBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <IconClose color={V.textMuted} size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TabBar active="garten" onNavigate={onNavigate} />

      {/* Edit container modal */}
      {showEditModal && (
        <ContainerModal
          mode="edit"
          container={container}
          onClose={() => setShowEditModal(false)}
          onSave={draft => {
            updateContainer(container.id, draft)
            setActiveContainer(container.id)
          }}
        />
      )}

      {/* Add plant modal */}
      {showPlantModal && (
        <PlantModal
          containerName={container.name}
          onClose={() => setShowPlantModal(false)}
          onSave={draft => addPlant(container.id, draft)}
        />
      )}
    </div>
  )
}
