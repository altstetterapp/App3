import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Cast to any so callers aren't burdened by generic table-type inference.
// Database schema is documented in src/types/database.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any | null = url && key ? createClient(url, key) : null
