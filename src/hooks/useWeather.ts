import { useState, useEffect } from 'react'
import type { WeatherDay } from '../types'

// Zürich-Altstetten
const LAT = 47.3925
const LON = 8.4952
const TZ  = 'Europe/Zurich'
const FROST_THRESHOLD = 4  // °C

const DE_DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

function toDateLabel(iso: string): string {
  // "2026-04-25" → "25.4"
  const [, m, d] = iso.split('-')
  return `${parseInt(d)}.${parseInt(m)}`
}

function todayInZurich(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date())
}

interface WeatherState {
  days: WeatherDay[]
  loading: boolean
  error: string | null
  hasFrost: boolean
}

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({
    days: [],
    loading: true,
    error: null,
    hasFrost: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude',       String(LAT))
    url.searchParams.set('longitude',      String(LON))
    url.searchParams.set('daily',          'temperature_2m_max,sunshine_duration,precipitation_sum')
    url.searchParams.set('past_days',      '5')
    url.searchParams.set('forecast_days',  '3')
    url.searchParams.set('timezone',       TZ)

    fetch(url.toString(), { signal: controller.signal })
      .then(r => {
        if (!r.ok) throw new Error(`Open-Meteo ${r.status}`)
        return r.json() as Promise<{
          daily: {
            time: string[]
            temperature_2m_max: number[]
            sunshine_duration: number[]   // seconds
            precipitation_sum: number[]   // mm
          }
        }>
      })
      .then(({ daily }) => {
        const todayStr = todayInZurich()

        const days: WeatherDay[] = daily.time.map((iso, i) => {
          const tempC  = Math.round(daily.temperature_2m_max[i])
          const sunH   = Math.round(daily.sunshine_duration[i] / 3600)
          const precip = Math.round(daily.precipitation_sum[i] * 10) / 10

          // getDay() needs local date — parse as noon Zurich to avoid DST edge
          const jsDate = new Date(`${iso}T12:00:00`)

          return {
            day:    DE_DAYS[jsDate.getDay()],
            date:   toDateLabel(iso),
            temp:   `${tempC}°`,
            tempC,
            sun:    `${sunH}h`,
            precip,
            isPast:  iso < todayStr,
            isToday: iso === todayStr,
          }
        })

        const hasFrost = days.some(d => d.tempC < FROST_THRESHOLD)
        setState({ days, loading: false, error: null, hasFrost })
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setState(s => ({ ...s, loading: false, error: String(err.message) }))
      })

    return () => controller.abort()
  }, [])

  return state
}
