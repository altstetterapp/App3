export type WaterStatus = 'ok' | 'warn' | 'due'
export type TabId = 'garten' | 'kalender' | 'giessen'
export type ScreenId = 'garten' | 'container-detail' | 'plant-profile' | 'giessen' | 'kalender'

// ─── Legacy display types (used by mockData + Screen4) ────────

export interface Container {
  id: string
  name: string
  plantNames: string
  plantCount: number
  imgUrl: string
  water: { status: WaterStatus; label: string }
}

export interface Plant {
  id: string
  name: string
  sub: string
  stage: string
  imgUrl: string
  water: { label: string; status: 'ok' | 'warn' }
  days: number
}

export interface WaterPot {
  id: string
  name: string
  plantNames: string
  imgUrl: string
  due: WaterStatus
  label: string
  ml: number
  lastDays: number
}

// ─── Mutable CRUD types (used by AppContext + Screens 1–3) ────

export interface PlantData {
  id: string
  name: string
  sub: string
  stage: string
  plantedDate: string   // YYYY-MM-DD
  imgUrl: string
  photoBase64?: string
  notes?: string
  sunExposure?: 'Vollsonne' | 'Halbsonnig' | 'Schattig' | 'Indoor'
  water: { label: string; status: 'ok' | 'warn' }
}

export interface PlantHistory {
  id: string
  plantName: string
  sub: string
  auspflanzDate: string // YYYY-MM-DD
  imgUrl: string
}

export interface ContainerData {
  id: string
  name: string
  imgUrl: string
  photoBase64?: string
  irrigated: boolean
  mlPerWeek?: number
  water: { status: WaterStatus; label: string }
  plants: PlantData[]
  history: PlantHistory[]
}

// ─── Calendar event types ─────────────────────────────────────

export interface WateringEvent {
  id: string
  date: string          // YYYY-MM-DD
  containerId: string
  plantId: string
  plantName: string
  ml?: number
}

export interface FertilizingEvent {
  id: string
  date: string          // YYYY-MM-DD
  containerId: string
  plantId: string
  plantName: string
  fertilizer?: string
}

export interface SchnittEvent {
  id: string
  date: string          // YYYY-MM-DD
  containerId: string
  plantId: string
  plantName: string
}

// ─── Shared ───────────────────────────────────────────────────

export interface WeatherDay {
  day: string
  date: string
  temp: string
  tempC: number
  sun: string
  precip: number
  isPast?: boolean
  isToday?: boolean
}

export interface NavProps {
  onNavigate: (target: ScreenId) => void
}
