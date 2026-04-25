import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import multer from 'multer'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app  = express()
const PORT = Number(process.env.PORT) || 3001
const PW   = process.env.APP_PASSWORD ?? 'dev'

console.log('APP_PASSWORD:', process.env.APP_PASSWORD ? 'SET' : 'NOT SET')

// ─── Middleware ───────────────────────────────────────────────

app.use(cors({
  origin: [
    'http://localhost:5173',   // vite dev
    'http://localhost:4173',   // vite preview
    /\.replit\.dev$/,          // replit preview domains
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-app-password'],
}))

app.use(express.json({ limit: '10mb' }))

// ─── Password gate ────────────────────────────────────────────

function requirePassword(req: Request, res: Response, next: NextFunction): void {
  if (req.headers['x-app-password'] !== PW) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}

// ─── POST /api/auth ───────────────────────────────────────────

app.post('/api/auth', (req: Request, res: Response) => {
  const { password } = req.body as { password?: string }
  if (password === PW) {
    res.json({ ok: true })
  } else {
    res.status(401).json({ error: 'Falsches Passwort' })
  }
})

// ─── GET /api/health ──────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: process.env.NODE_ENV ?? 'development' })
})

// ─── POST /api/ai ─────────────────────────────────────────────

interface AIBody {
  prompt: string
  systemPrompt?: string
  imageBase64?: string
}

app.post('/api/ai', requirePassword, (req: Request, res: Response) => {
  const { prompt, systemPrompt, imageBase64 } = req.body as AIBody

  console.log('[/api/ai]', {
    prompt:       prompt?.slice(0, 80),
    systemPrompt: systemPrompt?.slice(0, 60),
    image:        imageBase64 ? `${Math.round(imageBase64.length / 1024)} KB` : 'none',
  })

  // ── TODO (Replit): swap for real Anthropic SDK call ──────────
  // import Anthropic from '@anthropic-ai/sdk'
  // const client = new Anthropic()
  // const msg = await client.messages.create({ ... })
  // res.json({ text: msg.content[0].text })
  // ─────────────────────────────────────────────────────────────

  const p = (prompt ?? '').toLowerCase()

  let mockText: string
  if (p.includes('profil') || p.includes('pflegeprofil')) {
    mockText = [
      'Einpflanzen\nErdbeeren im Frühjahr (März–April) oder Herbst in lockere, humusreiche Erde pflanzen. Pflanzabstand 25–30 cm, Krone knapp über der Erdoberfläche lassen.',
      'Pflegetipps\nRegelmässig giessen, besonders während Blüte und Fruchtentwicklung. Ausläufer entfernen für stärkere Früchte. Nach der Ernte alte Blätter auf 10 cm zurückschneiden.',
      'Düngen\nIm Frühjahr mit Kompost oder Erdbeer-Langzeitdünger versorgen. Nicht überdüngen — zu viel Stickstoff fördert Blätter auf Kosten der Früchte.',
      'Ernte\nFrüchte erst bei vollständiger Rotfärbung ernten (Juni–Juli). Täglich kontrollieren, reife Beeren sofort pflücken um Fäulnis zu vermeiden.',
      'Überwinterung\nSehr winterhart bis −15 °C. Bei starkem Frost im Topf mit Vlies oder Stroh schützen und an eine windgeschützte Stelle stellen.',
    ].join('\n\n')
  } else if (p.includes('befall') || p.includes('schädling')) {
    mockText = imageBase64
      ? 'Es sind Anzeichen von Spinnmilbenbefall sichtbar: feine Gespinste unter den Blättern und gelbliche Verfärbungen. Sofortmassnahme: Pflanze isolieren und mit Neem-Öl-Lösung besprühen. Wiederholung nach 5–7 Tagen empfohlen. Auf gute Belüftung achten.'
      : 'Basierend auf der Beschreibung deutet vieles auf Blattlausbefall hin. Unterseiten der Blätter prüfen und befallene Triebe entfernen. Mit Schmierseifenlösung behandeln und natürliche Fressfeinde (Marienkäfer) fördern.'
  } else if (p.includes('auffälligkeit') || p.includes('auffaelligkeit')) {
    mockText = imageBase64
      ? 'Die gelben Blätter mit dunkleren Adern deuten auf Magnesiummangel hin. Empfehlung: mit Magnesiumsulfat-Lösung (Bittersalz, 15 g/l) giessen. Bodenprobe empfohlen. Verbesserung sollte nach 1–2 Wochen sichtbar sein.'
      : 'Die beschriebene Auffälligkeit könnte auf Staunässe oder Wurzelprobleme hinweisen. Erde auf Feuchte prüfen und ggf. Drainage verbessern. Falls die Symptome anhalten, Pflanze umpflanzen und Wurzeln inspizieren.'
  } else {
    mockText = imageBase64
      ? 'Die Pflanze sieht insgesamt gesund aus. Die Blätter zeigen eine kräftige Farbe ohne sichtbare Schäden. Ich empfehle, die Erde feucht aber nicht nass zu halten und auf ausreichende Sonneneinstrahlung zu achten. Keine unmittelbaren Massnahmen notwendig.'
      : 'Anfrage erhalten. Für eine genaue Analyse bitte ein Foto oder eine Beschreibung hinzufügen.'
  }

  res.json({ text: mockText })
})

// ─── POST /api/upload ─────────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are accepted'))
  },
})

app.post(
  '/api/upload',
  requirePassword,
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No image provided' })
      return
    }
    try {
      const buf = await sharp(req.file.buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 60 })
        .toBuffer()

      res.json({
        base64:   buf.toString('base64'),
        mimeType: 'image/jpeg',
        sizeKB:   Math.round(buf.length / 1024),
      })
    } catch (err) {
      console.error('[/api/upload] sharp error:', err)
      res.status(500).json({ error: 'Image processing failed' })
    }
  },
)

// ─── Static files (production) ────────────────────────────────

if (process.env.NODE_ENV === 'production') {
  const DIST = join(__dirname, '../dist')
  app.use(express.static(DIST))
  // SPA fallback — let React Router handle all non-API paths
  app.get('*', (_req, res) => res.sendFile(join(DIST, 'index.html')))
}

// ─── Start ────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌱 Rooftop Planner API  →  http://localhost:${PORT}`)
  console.log(`   Password gate         :  ${PW === 'dev' ? 'dev (default — set APP_PASSWORD to change)' : '***'}`)
  console.log(`   Claude AI             :  placeholder (set ANTHROPIC_API_KEY on Replit)\n`)
})
