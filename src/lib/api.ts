// Typed fetch wrapper for all backend calls.
// BASE_URL and APP_PASSWORD come from Vite env vars (VITE_ prefix exposes them to the browser).
// Defaults keep local dev zero-config.

const BASE_URL = (import.meta.env['VITE_API_URL']      as string | undefined) ?? ''
const APP_PW   = (import.meta.env['VITE_APP_PASSWORD'] as string | undefined) ?? 'dev'

function authHeaders(): Record<string, string> {
  return { 'x-app-password': APP_PW }
}

// ─── Types ───────────────────────────────────────────────────

export interface AIRequest {
  prompt: string
  systemPrompt?: string
  imageBase64?: string
}

export interface AIResponse {
  text: string
}

export interface UploadResponse {
  base64:   string
  mimeType: string
  sizeKB:   number
}

export interface HealthResponse {
  ok:   boolean
  mode: string
}

// ─── Internal helper ─────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(body),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`${path} → HTTP ${res.status}: ${msg}`)
  }
  return res.json() as Promise<T>
}

// ─── Public API ───────────────────────────────────────────────

/** Send a prompt (+ optional image) to the AI proxy. */
export function askAI(req: AIRequest): Promise<AIResponse> {
  return post<AIResponse>('/api/ai', req)
}

/** Upload an image file; server resizes to ≤800 px, 60 % JPEG, returns base64. */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('image', file)

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method:  'POST',
    // Do NOT set Content-Type — browser must set multipart boundary automatically
    headers: authHeaders(),
    body:    form,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`/api/upload → HTTP ${res.status}: ${msg}`)
  }
  return res.json() as Promise<UploadResponse>
}

/** Validate the app password against the server. Throws on wrong password. */
export async function authenticate(password: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${BASE_URL}/api/auth`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ password }),
  })
  if (!res.ok) throw new Error('Falsches Passwort')
  return res.json() as Promise<{ ok: boolean }>
}

/** Quick health check — useful for debugging connection issues. */
export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/api/health`)
  if (!res.ok) throw new Error(`health → HTTP ${res.status}`)
  return res.json() as Promise<HealthResponse>
}
