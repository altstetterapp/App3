/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

// Precache all Vite build output (manifest injected at build time)
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// Express API — network-first, 8s timeout
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 8,
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
)

// Open-Meteo weather — network-first, 1h cache
registerRoute(
  ({ url }) => url.hostname === 'api.open-meteo.com',
  new NetworkFirst({
    cacheName: 'weather-cache',
    networkTimeoutSeconds: 8,
    plugins: [
      new ExpirationPlugin({ maxAgeSeconds: 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
)

// Unsplash images — cache-first, 7-day TTL, max 60 entries
registerRoute(
  ({ url }) => url.hostname === 'images.unsplash.com',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  }),
)
