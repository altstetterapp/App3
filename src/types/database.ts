export interface Database {
  public: {
    Tables: {
      containers: {
        Row: {
          id: string
          name: string
          img_url: string
          photo_base64: string | null
          irrigated: boolean
          ml_per_week: number | null
          water_status: 'ok' | 'warn' | 'due'
          water_label: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['containers']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['containers']['Insert']>
      }
      plants: {
        Row: {
          id: string
          container_id: string
          name: string
          sub: string
          stage: string
          planted_date: string
          img_url: string
          photo_base64: string | null
          notes: string | null
          sun_exposure: 'Vollsonne' | 'Halbsonnig' | 'Schattig' | 'Indoor' | null
          water_label: string
          water_status: 'ok' | 'warn'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['plants']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['plants']['Insert']>
      }
      watering_events: {
        Row: {
          id: string
          date: string
          container_id: string
          plant_id: string
          plant_name: string
          ml: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['watering_events']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['watering_events']['Insert']>
      }
      fertilizing_events: {
        Row: {
          id: string
          date: string
          container_id: string
          plant_id: string
          plant_name: string
          fertilizer: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['fertilizing_events']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['fertilizing_events']['Insert']>
      }
      schnitt_events: {
        Row: {
          id: string
          date: string
          container_id: string
          plant_id: string
          plant_name: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['schnitt_events']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['schnitt_events']['Insert']>
      }
      observations: {
        Row: {
          id: string
          date: string
          container_id: string
          plant_id: string | null
          note: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['observations']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['observations']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
