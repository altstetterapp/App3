# Rooftop Planner

A Progressive Web App (PWA) for managing rooftop gardens. Users can track containers, plants, watering schedules, fertilization, and plant health with AI-assisted diagnostics (in German).

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4, built with Vite
- **Backend**: Node.js + Express (serves both the API and the built Vite assets in production)
- **Storage**: Dual-layer — Supabase (cloud sync, optional) + localStorage (local persistence/offline)
- **PWA**: Service worker via `vite-plugin-pwa` / Workbox for offline support

## Running the App

The workflow builds everything and starts Express on port 5000:
```
npm install --include=dev && npm run build && PORT=5000 node server/index.js
```

In production/deployed mode, Express serves the built `dist/` folder and handles all API routes.

## Key Configuration

### Environment Variables / Secrets

| Variable | Required | Purpose |
|---|---|---|
| `APP_PASSWORD` | No | Password gate (defaults to `dev` if not set) |
| `VITE_SUPABASE_URL` | No | Supabase project URL for cloud sync |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `ANTHROPIC_API_KEY` | No | Enables real Claude AI plant diagnostics (placeholder mock if not set) |

> **Note**: `VITE_*` vars are baked into the frontend at build time. If you change them, you must rebuild (`npm run build`).

### Ports

- Port `5000` — main Express server (serves both API and built frontend)

## Project Structure

```
src/
  App.tsx                    # Root component, routing between screens
  main.tsx                   # React entry point
  context/AppContext.tsx     # Global state, Supabase sync, localStorage
  lib/api.ts                 # Typed API client (calls Express backend)
  lib/supabase.ts            # Supabase client (null if keys not set)
  components/screens/        # Screen-level React components (Login, Screen1–5)
  components/ui/             # Reusable UI components (modals, sheets, etc.)
  tokens.ts                  # Design tokens (colors, spacing, typography)
  types.ts                   # App-level TypeScript types
  types/database.ts          # Supabase database schema types
  sw.ts                      # Service worker (Workbox)
server/
  index.ts                   # Express server (auth, AI proxy, image upload, static files)
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth` | None | Validate app password |
| `GET` | `/api/health` | None | Health check |
| `POST` | `/api/ai` | Password | AI plant diagnostics (Claude or mock) |
| `POST` | `/api/upload` | Password | Upload & resize image (returns base64) |

## AI Integration

The `/api/ai` endpoint currently returns mock responses. To enable real AI:
1. Set the `ANTHROPIC_API_KEY` secret in Replit
2. Replace the mock response section in `server/index.ts` with the Anthropic SDK call (see the TODO comment in the file)

## Supabase Integration (Optional)

The app works fully offline without Supabase using localStorage. To enable cloud sync:
1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` secrets
2. Rebuild the app (`npm run build`)
3. Database tables needed: `containers`, `plants`, `watering_events`, `fertilizing_events`, `schnitt_events`
