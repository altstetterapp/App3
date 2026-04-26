import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ContainerData, PlantData, PlantHistory, WateringEvent, FertilizingEvent, SchnittEvent } from '../types'
import { supabase } from '../lib/supabase'

// ─── Initial seed data ────────────────────────────────────────

const IMG = {
  rosmarin:  'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600&q=70&auto=format&fit=crop',
  erdbeere:  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=70&auto=format&fit=crop',
  tomate:    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=70&auto=format&fit=crop',
  basilikum: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=70&auto=format&fit=crop',
  mangold:   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=70&auto=format&fit=crop',
  chili:     'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=70&auto=format&fit=crop',
}

const SEED: ContainerData[] = [
  {
    id: 'rosmarin', name: 'Rosmarin-Topf', imgUrl: IMG.rosmarin,
    irrigated: false, water: { status: 'ok', label: 'Gegossen vor 2 Std.' },
    plants: [
      { id: 'p-ros-1', name: 'Rosmarin', sub: 'Rosmarinus officinalis', stage: 'Blüte',
        plantedDate: '2026-04-01', imgUrl: IMG.rosmarin, water: { label: 'In 2 Tagen', status: 'ok' } },
    ],
    history: [],
  },
  {
    id: 'beeren', name: 'Beeren-Kiste', imgUrl: IMG.erdbeere,
    irrigated: false, water: { status: 'warn', label: 'Heute giessen' },
    plants: [
      { id: 'p-ber-1', name: 'Rosmarin',  sub: 'Rosmarinus officinalis', stage: 'Blüte',
        plantedDate: '2026-04-01', imgUrl: IMG.rosmarin, water: { label: 'In 2 Tagen',    status: 'ok'   } },
      { id: 'p-ber-2', name: 'Erdbeere',  sub: 'Fragaria × ananassa',   stage: 'Fruchtbildung',
        plantedDate: '2026-03-14', imgUrl: IMG.erdbeere, water: { label: 'Heute giessen', status: 'warn' } },
      { id: 'p-ber-3', name: 'Mangold',   sub: 'Beta vulgaris',          stage: 'Wachstum',
        plantedDate: '2026-04-07', imgUrl: IMG.mangold,  water: { label: 'Morgen',        status: 'ok'   } },
    ],
    history: [],
  },
  {
    id: 'kraeuter', name: 'Kräuter-Box', imgUrl: IMG.basilikum,
    irrigated: false, water: { status: 'ok', label: 'Gegossen gestern' },
    plants: [
      { id: 'p-kra-1', name: 'Basilikum', sub: 'Ocimum basilicum',   stage: 'Wachstum',
        plantedDate: '2026-04-10', imgUrl: IMG.basilikum, water: { label: 'Morgen',      status: 'ok' } },
      { id: 'p-kra-2', name: 'Salbei',    sub: 'Salvia officinalis', stage: 'Wachstum',
        plantedDate: '2026-04-05', imgUrl: IMG.rosmarin,  water: { label: 'In 2 Tagen', status: 'ok' } },
      { id: 'p-kra-3', name: 'Thymian',   sub: 'Thymus vulgaris',    stage: 'Blüte',
        plantedDate: '2026-03-28', imgUrl: IMG.rosmarin,  water: { label: 'Morgen',     status: 'ok' } },
    ],
    history: [],
  },
  {
    id: 'tomaten', name: 'Tomaten-Kübel', imgUrl: IMG.tomate,
    irrigated: true, mlPerWeek: 800, water: { status: 'due', label: 'Seit 2 Tagen trocken' },
    plants: [
      { id: 'p-tom-1', name: 'Cherry-Tomate', sub: 'Solanum lycopersicum', stage: 'Blüte',
        plantedDate: '2026-04-03', imgUrl: IMG.tomate, water: { label: 'Seit 2 Tagen trocken', status: 'warn' } },
    ],
    history: [],
  },
  {
    id: 'chili', name: 'Chili-Topf', imgUrl: IMG.chili,
    irrigated: false, water: { status: 'ok', label: 'In 2 Tagen' },
    plants: [
      { id: 'p-chi-1', name: 'Chili Piccante', sub: 'Capsicum annuum', stage: 'Setzling',
        plantedDate: '2026-04-15', imgUrl: IMG.chili, water: { label: 'In 2 Tagen', status: 'ok' } },
    ],
    history: [],
  },
]

const SEED_WATERING: WateringEvent[] = [
  { id: 'we-1', date: '2026-04-24', containerId: 'beeren',   plantId: 'p-ber-2', plantName: 'Erdbeere',       ml: 200 },
  { id: 'we-2', date: '2026-04-24', containerId: 'rosmarin', plantId: 'p-ros-1', plantName: 'Rosmarin',       ml: 150 },
  { id: 'we-3', date: '2026-04-22', containerId: 'kraeuter', plantId: 'p-kra-1', plantName: 'Basilikum',      ml: 100 },
  { id: 'we-4', date: '2026-04-21', containerId: 'tomaten',  plantId: 'p-tom-1', plantName: 'Cherry-Tomate',  ml: 400 },
  { id: 'we-5', date: '2026-04-21', containerId: 'beeren',   plantId: 'p-ber-3', plantName: 'Mangold',        ml: 150 },
  { id: 'we-6', date: '2026-04-19', containerId: 'beeren',   plantId: 'p-ber-1', plantName: 'Rosmarin',       ml: 150 },
  { id: 'we-7', date: '2026-04-19', containerId: 'chili',    plantId: 'p-chi-1', plantName: 'Chili Piccante', ml: 180 },
  { id: 'we-8', date: '2026-04-17', containerId: 'tomaten',  plantId: 'p-tom-1', plantName: 'Cherry-Tomate',  ml: 350 },
  { id: 'we-9', date: '2026-04-17', containerId: 'beeren',   plantId: 'p-ber-2', plantName: 'Erdbeere',       ml: 200 },
]

const SEED_FERTILIZING: FertilizingEvent[] = [
  { id: 'fe-1', date: '2026-04-20', containerId: 'beeren',  plantId: 'p-ber-2', plantName: 'Erdbeere',      fertilizer: 'Kompost'       },
  { id: 'fe-2', date: '2026-04-15', containerId: 'tomaten', plantId: 'p-tom-1', plantName: 'Cherry-Tomate', fertilizer: 'Flüssigdünger' },
  { id: 'fe-3', date: '2026-04-10', containerId: 'beeren',  plantId: 'p-ber-1', plantName: 'Rosmarin',      fertilizer: 'Langzeitdünger'},
]

const uid = () => Math.random().toString(36).slice(2, 10)

// ─── localStorage helpers ─────────────────────────────────────

function loadLocal(): ContainerData[] {
  try {
    const raw = localStorage.getItem('rp_containers')
    if (raw) return JSON.parse(raw) as ContainerData[]
  } catch { /* ignore */ }
  return SEED
}

function loadLocalEvents<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch { return fallback }
}

function saveLocal(data: ContainerData[]) {
  try { localStorage.setItem('rp_containers', JSON.stringify(data)) } catch { /* quota exceeded */ }
}

// ─── Supabase → app-type mappers ─────────────────────────────

function dbRowsToContainers(
  rows: { containers: { id: string; name: string; img_url: string; photo_base64: string | null; irrigated: boolean; ml_per_week: number | null; water_status: string; water_label: string }[]; plants: { id: string; container_id: string; name: string; sub: string; stage: string; planted_date: string; img_url: string; photo_base64: string | null; notes: string | null; sun_exposure: string | null; water_label: string; water_status: string }[] }
): ContainerData[] {
  const plantsByContainer = new Map<string, PlantData[]>()
  for (const p of rows.plants) {
    const list = plantsByContainer.get(p.container_id) ?? []
    list.push({
      id: p.id,
      name: p.name,
      sub: p.sub,
      stage: p.stage,
      plantedDate: p.planted_date,
      imgUrl: p.img_url,
      photoBase64: p.photo_base64 ?? undefined,
      notes: p.notes ?? undefined,
      sunExposure: (p.sun_exposure as PlantData['sunExposure']) ?? undefined,
      water: { label: p.water_label, status: p.water_status as 'ok' | 'warn' },
    })
    plantsByContainer.set(p.container_id, list)
  }
  return rows.containers.map(c => ({
    id: c.id,
    name: c.name,
    imgUrl: c.img_url,
    photoBase64: c.photo_base64 ?? undefined,
    irrigated: c.irrigated,
    mlPerWeek: c.ml_per_week ?? undefined,
    water: { status: c.water_status as 'ok' | 'warn' | 'due', label: c.water_label },
    plants: plantsByContainer.get(c.id) ?? [],
    history: [],
  }))
}

// ─── Context definition ───────────────────────────────────────

interface AppCtx {
  containers: ContainerData[]
  loading: boolean
  activeContainerId: string
  activePlantId: string
  setActiveContainer: (id: string) => void
  setActivePlant: (id: string) => void
  addContainer:    (draft: Omit<ContainerData, 'id' | 'plants' | 'history'>) => void
  updateContainer: (id: string, patch: Partial<Omit<ContainerData, 'id' | 'plants' | 'history'>>) => void
  deleteContainer: (id: string) => void
  addPlant:        (containerId: string, draft: Omit<PlantData, 'id'>) => void
  updatePlant:     (containerId: string, plantId: string, patch: Partial<Omit<PlantData, 'id'>>) => void
  auspflanzen:     (containerId: string, plantId: string, date: string) => void
  deleteHistory:   (containerId: string, historyId: string) => void
  // Calendar / action events
  wateringEvents:       WateringEvent[]
  fertilizingEvents:    FertilizingEvent[]
  schnittEvents:        SchnittEvent[]
  addWateringEvent:     (e: Omit<WateringEvent, 'id'>) => void
  addFertilizingEvent:  (e: Omit<FertilizingEvent, 'id'>) => void
  addSchnittEvent:      (e: Omit<SchnittEvent, 'id'>) => void
  removeWateringEvent:  (id: string) => void
  removeFertilizingEvent: (id: string) => void
  removeSchnittEvent:   (id: string) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const hasSupabase = supabase !== null
  const localEmpty  = !localStorage.getItem('rp_containers')

  const [loading,    setLoading]    = useState(hasSupabase && localEmpty)
  const [containers, setContainers] = useState<ContainerData[]>(() => loadLocal())
  const [activeContainerId, setActiveContainerId] = useState('beeren')
  const [activePlantId,     setActivePlantId]     = useState('p-ber-2')

  const [wateringEvents,    setWateringEvents]    = useState<WateringEvent[]>(
    () => loadLocalEvents('rp_watering', SEED_WATERING)
  )
  const [fertilizingEvents, setFertilizingEvents] = useState<FertilizingEvent[]>(
    () => loadLocalEvents('rp_fertilizing', SEED_FERTILIZING)
  )
  const [schnittEvents,     setSchnittEvents]     = useState<SchnittEvent[]>(
    () => loadLocalEvents('rp_schnitt', [])
  )

  // ─── Load from Supabase on mount ─────────────────────────────
  useEffect(() => {
    if (!supabase) return
    ;(async () => {
      try {
        const [{ data: cRows }, { data: pRows }, { data: wRows }, { data: fRows }, { data: sRows }] =
          await Promise.all([
            supabase.from('containers').select('*').order('created_at'),
            supabase.from('plants').select('*').order('created_at'),
            supabase.from('watering_events').select('*').order('date', { ascending: false }),
            supabase.from('fertilizing_events').select('*').order('date', { ascending: false }),
            supabase.from('schnitt_events').select('*').order('date', { ascending: false }),
          ])

        if (cRows && cRows.length > 0) {
          const merged = dbRowsToContainers({ containers: cRows as Parameters<typeof dbRowsToContainers>[0]['containers'], plants: (pRows ?? []) as Parameters<typeof dbRowsToContainers>[0]['plants'] })
          setContainers(merged)
          saveLocal(merged)
        }
        if (wRows && wRows.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: WateringEvent[] = wRows.map((r: any) => ({
            id: r.id, date: r.date, containerId: r.container_id,
            plantId: r.plant_id, plantName: r.plant_name, ml: r.ml ?? undefined,
          }))
          setWateringEvents(mapped)
          try { localStorage.setItem('rp_watering', JSON.stringify(mapped)) } catch { /* quota */ }
        }
        if (fRows && fRows.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: FertilizingEvent[] = fRows.map((r: any) => ({
            id: r.id, date: r.date, containerId: r.container_id,
            plantId: r.plant_id, plantName: r.plant_name, fertilizer: r.fertilizer ?? undefined,
          }))
          setFertilizingEvents(mapped)
          try { localStorage.setItem('rp_fertilizing', JSON.stringify(mapped)) } catch { /* quota */ }
        }
        if (sRows && sRows.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: SchnittEvent[] = sRows.map((r: any) => ({
            id: r.id, date: r.date, containerId: r.container_id,
            plantId: r.plant_id, plantName: r.plant_name,
          }))
          setSchnittEvents(mapped)
          try { localStorage.setItem('rp_schnitt', JSON.stringify(mapped)) } catch { /* quota */ }
        }
      } catch (err) {
        console.warn('[Supabase] load failed, using local data:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Persist to localStorage on every change ─────────────────
  useEffect(() => { saveLocal(containers) }, [containers])
  useEffect(() => {
    try { localStorage.setItem('rp_watering',    JSON.stringify(wateringEvents))    } catch { /* quota */ }
  }, [wateringEvents])
  useEffect(() => {
    try { localStorage.setItem('rp_fertilizing', JSON.stringify(fertilizingEvents)) } catch { /* quota */ }
  }, [fertilizingEvents])
  useEffect(() => {
    try { localStorage.setItem('rp_schnitt', JSON.stringify(schnittEvents)) } catch { /* quota */ }
  }, [schnittEvents])

  const setActiveContainer = useCallback((id: string) => setActiveContainerId(id), [])
  const setActivePlant     = useCallback((id: string) => setActivePlantId(id),     [])

  // ─── Container CRUD ───────────────────────────────────────────

  const addContainer = useCallback((draft: Omit<ContainerData, 'id' | 'plants' | 'history'>) => {
    const id = crypto.randomUUID()
    setContainers(prev => {
      const next = [...prev, { ...draft, id, plants: [], history: [] }]
      saveLocal(next); return next
    })
    supabase?.from('containers').insert({
      id,
      name: draft.name,
      img_url: draft.imgUrl,
      photo_base64: draft.photoBase64 ?? null,
      irrigated: draft.irrigated,
      ml_per_week: draft.mlPerWeek ?? null,
      water_status: draft.water.status,
      water_label: draft.water.label,
    })// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] addContainer:', error.message) })
  }, [])

  const updateContainer = useCallback((id: string, patch: Partial<Omit<ContainerData, 'id' | 'plants' | 'history'>>) => {
    setContainers(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...patch } : c)
      saveLocal(next); return next
    })
    const dbPatch: Record<string, unknown> = {}
    if (patch.name       !== undefined) dbPatch.name         = patch.name
    if (patch.imgUrl     !== undefined) dbPatch.img_url      = patch.imgUrl
    if (patch.photoBase64!== undefined) dbPatch.photo_base64 = patch.photoBase64 ?? null
    if (patch.irrigated  !== undefined) dbPatch.irrigated    = patch.irrigated
    if (patch.mlPerWeek  !== undefined) dbPatch.ml_per_week  = patch.mlPerWeek ?? null
    if (patch.water      !== undefined) { dbPatch.water_status = patch.water.status; dbPatch.water_label = patch.water.label }
    if (Object.keys(dbPatch).length > 0)
      supabase?.from('containers').update(dbPatch).eq('id', id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] updateContainer:', error.message) })
  }, [])

  const deleteContainer = useCallback((id: string) => {
    setContainers(prev => {
      const next = prev.filter(c => c.id !== id)
      saveLocal(next); return next
    })
    supabase?.from('containers').delete().eq('id', id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] deleteContainer:', error.message) })
  }, [])

  // ─── Plant CRUD ───────────────────────────────────────────────

  const addPlant = useCallback((containerId: string, draft: Omit<PlantData, 'id'>) => {
    const id = crypto.randomUUID()
    setContainers(prev => {
      const next = prev.map(c => c.id === containerId
        ? { ...c, plants: [...c.plants, { ...draft, id }] }
        : c)
      saveLocal(next); return next
    })
    supabase?.from('plants').insert({
      id,
      container_id: containerId,
      name: draft.name,
      sub: draft.sub,
      stage: draft.stage,
      planted_date: draft.plantedDate,
      img_url: draft.imgUrl,
      photo_base64: draft.photoBase64 ?? null,
      notes: draft.notes ?? null,
      sun_exposure: draft.sunExposure ?? null,
      water_label: draft.water.label,
      water_status: draft.water.status,
    })// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] addPlant:', error.message) })
  }, [])

  const updatePlant = useCallback((containerId: string, plantId: string, patch: Partial<Omit<PlantData, 'id'>>) => {
    setContainers(prev => {
      const next = prev.map(c => c.id !== containerId ? c : {
        ...c,
        plants: c.plants.map(p => p.id === plantId ? { ...p, ...patch } : p),
      })
      saveLocal(next); return next
    })
    const dbPatch: Record<string, unknown> = {}
    if (patch.name        !== undefined) dbPatch.name         = patch.name
    if (patch.sub         !== undefined) dbPatch.sub          = patch.sub
    if (patch.stage       !== undefined) dbPatch.stage        = patch.stage
    if (patch.plantedDate !== undefined) dbPatch.planted_date = patch.plantedDate
    if (patch.imgUrl      !== undefined) dbPatch.img_url      = patch.imgUrl
    if (patch.photoBase64 !== undefined) dbPatch.photo_base64 = patch.photoBase64 ?? null
    if (patch.notes       !== undefined) dbPatch.notes        = patch.notes ?? null
    if (patch.sunExposure !== undefined) dbPatch.sun_exposure = patch.sunExposure ?? null
    if (patch.water       !== undefined) { dbPatch.water_label = patch.water.label; dbPatch.water_status = patch.water.status }
    if (Object.keys(dbPatch).length > 0)
      supabase?.from('plants').update(dbPatch).eq('id', plantId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] updatePlant:', error.message) })
  }, [])

  const auspflanzen = useCallback((containerId: string, plantId: string, date: string) => {
    setContainers(prev => {
      const next = prev.map(c => {
        if (c.id !== containerId) return c
        const plant = c.plants.find(p => p.id === plantId)
        if (!plant) return c
        const entry: PlantHistory = {
          id: uid(), plantName: plant.name, sub: plant.sub,
          auspflanzDate: date, imgUrl: plant.photoBase64 ? '' : plant.imgUrl,
        }
        return { ...c, plants: c.plants.filter(p => p.id !== plantId), history: [entry, ...c.history] }
      })
      saveLocal(next); return next
    })
    supabase?.from('plants').delete().eq('id', plantId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] auspflanzen delete plant:', error.message) })
  }, [])

  const deleteHistory = useCallback((containerId: string, historyId: string) => {
    setContainers(prev => {
      const next = prev.map(c => c.id === containerId
        ? { ...c, history: c.history.filter(h => h.id !== historyId) }
        : c)
      saveLocal(next); return next
    })
  }, [])

  // ─── Event CRUD ───────────────────────────────────────────────

  const addWateringEvent = useCallback((e: Omit<WateringEvent, 'id'>) => {
    const id = crypto.randomUUID()
    setWateringEvents(prev => [...prev, { ...e, id }])
    supabase?.from('watering_events').insert({
      id, date: e.date, container_id: e.containerId,
      plant_id: e.plantId, plant_name: e.plantName, ml: e.ml ?? null,
    })// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] addWatering:', error.message) })
  }, [])

  const addFertilizingEvent = useCallback((e: Omit<FertilizingEvent, 'id'>) => {
    const id = crypto.randomUUID()
    setFertilizingEvents(prev => [...prev, { ...e, id }])
    supabase?.from('fertilizing_events').insert({
      id, date: e.date, container_id: e.containerId,
      plant_id: e.plantId, plant_name: e.plantName, fertilizer: e.fertilizer ?? null,
    })// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] addFertilizing:', error.message) })
  }, [])

  const addSchnittEvent = useCallback((e: Omit<SchnittEvent, 'id'>) => {
    const id = crypto.randomUUID()
    setSchnittEvents(prev => [...prev, { ...e, id }])
    supabase?.from('schnitt_events').insert({
      id, date: e.date, container_id: e.containerId,
      plant_id: e.plantId, plant_name: e.plantName,
    })// eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] addSchnitt:', error.message) })
  }, [])

  const removeWateringEvent = useCallback((id: string) => {
    setWateringEvents(prev => prev.filter(e => e.id !== id))
    supabase?.from('watering_events').delete().eq('id', id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] removeWatering:', error.message) })
  }, [])

  const removeFertilizingEvent = useCallback((id: string) => {
    setFertilizingEvents(prev => prev.filter(e => e.id !== id))
    supabase?.from('fertilizing_events').delete().eq('id', id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] removeFertilizing:', error.message) })
  }, [])

  const removeSchnittEvent = useCallback((id: string) => {
    setSchnittEvents(prev => prev.filter(e => e.id !== id))
    supabase?.from('schnitt_events').delete().eq('id', id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => { if (error) console.warn('[Supabase] removeSchnitt:', error.message) })
  }, [])

  return (
    <Ctx.Provider value={{
      containers, loading,
      activeContainerId, activePlantId,
      setActiveContainer, setActivePlant,
      addContainer, updateContainer, deleteContainer,
      addPlant, updatePlant, auspflanzen, deleteHistory,
      wateringEvents, fertilizingEvents, schnittEvents,
      addWateringEvent, addFertilizingEvent, addSchnittEvent,
      removeWateringEvent, removeFertilizingEvent, removeSchnittEvent,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

/** Compute days since a YYYY-MM-DD planted date */
export function daysSince(dateStr: string): number {
  const planted = new Date(dateStr)
  const today   = new Date()
  return Math.max(0, Math.floor((today.getTime() - planted.getTime()) / (1000 * 60 * 60 * 24)))
}
