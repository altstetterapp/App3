import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/icons')
mkdirSync(outDir, { recursive: true })

// Terracotta palette
// bg: #2b1f16  accent: #7a8a4a  leaf-mid: #8fa055  leaf-light: #a3b85f  stem: #fbf6ee

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Background rounded square -->
  <rect width="512" height="512" rx="112" fill="#2b1f16"/>

  <!-- Center stem -->
  <rect x="247" y="170" width="18" height="202" rx="9" fill="#fbf6ee"/>

  <!-- Root spread -->
  <path d="M218 368 Q256 384 294 368" stroke="#fbf6ee" stroke-width="13"
        fill="none" stroke-linecap="round"/>

  <!-- Left leaf (lower) -->
  <ellipse cx="200" cy="292" rx="70" ry="27"
           fill="#7a8a4a" transform="rotate(-32 200 292)"/>

  <!-- Right leaf (upper) -->
  <ellipse cx="314" cy="256" rx="70" ry="27"
           fill="#7a8a4a" transform="rotate(32 314 256)"/>

  <!-- Left leaf (upper) -->
  <ellipse cx="212" cy="238" rx="54" ry="21"
           fill="#8fa055" transform="rotate(-28 212 238)"/>

  <!-- Right leaf (lower-ish) -->
  <ellipse cx="302" cy="310" rx="50" ry="20"
           fill="#8fa055" transform="rotate(28 302 310)"/>

  <!-- Top bud -->
  <ellipse cx="256" cy="168" rx="20" ry="30" fill="#a3b85f"/>

  <!-- Highlight on bud -->
  <ellipse cx="250" cy="156" rx="7" ry="10" fill="#c8d87a" opacity="0.6"/>
</svg>`

async function generate(size: number, filename: string) {
  await sharp(Buffer.from(SVG))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(resolve(outDir, filename))
  console.log(`✓ ${filename} (${size}×${size})`)
}

await generate(512, 'icon-512.png')
await generate(192, 'icon-192.png')
await generate(180, 'apple-touch-icon.png')
console.log('Icons done.')
