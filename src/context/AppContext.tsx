import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ContainerData, PlantData, PlantHistory, WateringEvent, FertilizingEvent } from '../types'

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

function load(): ContainerData[] {
  try {
    const raw = localStorage.getItem('rp_containers')
    if (raw) return JSON.parse(raw) as ContainerData[]
  } catch { /* ignore */ }
  return SEED
}

function loadEvents<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch { return fallback }
}

function save(data: ContainerData[]) {
  try { localStorage.setItem('rp_containers', JSON.stringify(data)) } catch { /* quota exceeded */ }
}

// ─── Context definition ───────────────────────────────────────

interface AppCtx {
  containers: ContainerData[]
  activeContainerId: string
  activePlantId: string
  setActiveContainer: (id: string) => void
  setActivePlant: (id: string) => void
  addContainer:    (draft: Omit<ContainerData, 'id' | 'plants' | 'history'>) => void
  updateContainer: (id: string, patch: Partial<Omit<ContainerData, 'id' | 'plants' | 'history'>>) => void
  deleteContainer: (id: string) => void
  addPlant:        (containerId: string, draft: Omit<PlantData, 'id'>) => void
  auspflanzen:     (containerId: string, plantId: string, date: string) => void
  deleteHistory:   (containerId: string, historyId: string) => void
  // Calendar events
  wateringEvents:       WateringEvent[]
  fertilizingEvents:    FertilizingEvent[]
  addWateringEvent:     (e: Omit<WateringEvent, 'id'>) => void
  addFertilizingEvent:  (e: Omit<FertilizingEvent, 'id'>) => void
  removeWateringEvent:  (id: string) => void
  removeFertilizingEvent: (id: string) => void
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [containers, setContainers] = useState<ContainerData[]>(load)
  const [activeContainerId, setActiveContainerId] = useState('beeren')
  const [activePlantId,     setActivePlantId]     = useState('p-ber-2')

  const [wateringEvents,    setWateringEvents]    = useState<WateringEvent[]>(
    () => loadEvents('rp_watering', SEED_WATERING)
  )
  const [fertilizingEvents, setFertilizingEvents] = useState<FertilizingEvent[]>(
    () => loadEvents('rp_fertilizing', SEED_FERTILIZING)
  )

  useEffect(() => { save(containers) }, [containers])
  useEffect(() => {
    try { localStorage.setItem('rp_watering',    JSON.stringify(wateringEvents))    } catch { /* quota */ }
  }, [wateringEvents])
  useEffect(() => {
    try { localStorage.setItem('rp_fertilizing', JSON.stringify(fertilizingEvents)) } catch { /* quota */ }
  }, [fertilizingEvents])

  const setActiveContainer = useCallback((id: string) => setActiveContainerId(id), [])
  const setActivePlant     = useCallback((id: string) => setActivePlantId(id),     [])

  const addContainer = useCallback((draft: Omit<ContainerData, 'id' | 'plants' | 'history'>) => {
    setContainers(prev => {
      const next = [...prev, { ...draft, id: uid(), plants: [], history: [] }]
      save(next); return next
    })
  }, [])

  const updateContainer = useCallback((id: string, patch: Partial<Omit<ContainerData, 'id' | 'plants' | 'history'>>) => {
    setContainers(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...patch } : c)
      save(next); return next
    })
  }, [])

  const deleteContainer = useCallback((id: string) => {
    setContainers(prev => {
      const next = prev.filter(c => c.id !== id)
      save(next); return next
    })
  }, [])

  const addPlant = useCallback((containerId: string, draft: Omit<PlantData, 'id'>) => {
    setContainers(prev => {
      const next = prev.map(c => c.id === containerId
        ? { ...c, plants: [...c.plants, { ...draft, id: uid() }] }
        : c)
      save(next); return next
    })
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
      save(next); return next
    })
  }, [])

  const deleteHistory = useCallback((containerId: string, historyId: string) => {
    setContainers(prev => {
      const next = prev.map(c => c.id === containerId
        ? { ...c, history: c.history.filter(h => h.id !== historyId) }
        : c)
      save(next); return next
    })
  }, [])

  const addWateringEvent = useCallback((e: Omit<WateringEvent, 'id'>) => {
    setWateringEvents(prev => [...prev, { ...e, id: uid() }])
  }, [])

  const addFertilizingEvent = useCallback((e: Omit<FertilizingEvent, 'id'>) => {
    setFertilizingEvents(prev => [...prev, { ...e, id: uid() }])
  }, [])

  const removeWateringEvent = useCallback((id: string) => {
    setWateringEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  const removeFertilizingEvent = useCallback((id: string) => {
    setFertilizingEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  return (
    <Ctx.Provider value={{
      containers, activeContainerId, activePlantId,
      setActiveContainer, setActivePlant,
      addContainer, updateContainer, deleteContainer,
      addPlant, auspflanzen, deleteHistory,
      wateringEvents, fertilizingEvents,
      addWateringEvent, addFertilizingEvent,
      removeWateringEvent, removeFertilizingEvent,
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
