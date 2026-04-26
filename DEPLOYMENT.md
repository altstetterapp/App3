# Deployment — Replit

## Required environment variables

Set these in the Replit **Secrets** panel (padlock icon in the sidebar):

| Variable | Required | Description |
|---|---|---|
| `APP_PASSWORD` | **Yes** | Password for the login gate. Default in dev is `dev` — always override in production. |
| `VITE_SUPABASE_URL` | **Yes** | Supabase project URL, e.g. `https://xxxxxx.supabase.co`. Without it the app falls back to localStorage only. |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Supabase `anon` public key (JWT). Safe to expose in the browser. |
| `ANTHROPIC_API_KEY` | No (mock active) | Anthropic API key for real AI responses. Without it the server returns mock text. |
| `PORT` | No | HTTP port the server listens on. Replit sets this automatically; default is `3001`. |
| `NODE_ENV` | No | Set to `production` to enable static file serving of `dist/`. The `.replit` file sets this automatically. |

## Deploy steps

1. Import the repo into Replit (or push to a connected repo).
2. Open **Secrets** and add `APP_PASSWORD`.
3. Click **Run** — Replit executes:
   ```
   npm install && npm run build && node server/index.js
   ```
   This installs deps, builds the Vite frontend + compiles the server, then starts Express which serves both the API and the `dist/` static files on a single port.
4. The app is live at your Replit URL.

## How it works in production

- `NODE_ENV=production` (set by `.replit`) activates `express.static('dist/')` in the server.
- All `/api/*` requests are handled by Express routes.
- All other requests fall through to `dist/index.html` (SPA catch-all).
- The PWA service worker (`dist/sw.js`) caches static assets on first load.

## Local development

```bash
npm run dev        # Vite dev server (port 5173) + Express (port 3001)
npm run build      # Type-check + Vite build + compile server → server/index.js
```
