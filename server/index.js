import express from "express";
import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const PW = process.env.APP_PASSWORD ?? "dev";
console.log("APP_PASSWORD:", process.env.APP_PASSWORD ? "SET" : "NOT SET");
app.use(cors({
  origin: [
    "http://localhost:5173",
    // vite dev
    "http://localhost:4173",
    // vite preview
    /\.replit\.dev$/
    // replit preview domains
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-app-password"]
}));
app.use(express.json({ limit: "10mb" }));
function requirePassword(req, res, next) {
  if (req.headers["x-app-password"] !== PW) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
app.post("/api/auth", (req, res) => {
  const { password } = req.body;
  if (password === PW) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: "Falsches Passwort" });
  }
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: process.env.NODE_ENV ?? "development" });
});
app.post("/api/ai", requirePassword, (req, res) => {
  const { prompt, systemPrompt, imageBase64 } = req.body;
  console.log("[/api/ai]", {
    prompt: prompt?.slice(0, 80),
    systemPrompt: systemPrompt?.slice(0, 60),
    image: imageBase64 ? `${Math.round(imageBase64.length / 1024)} KB` : "none"
  });
  const p = (prompt ?? "").toLowerCase();
  let mockText;
  if (p.includes("profil") || p.includes("pflegeprofil")) {
    mockText = [
      "Einpflanzen\nErdbeeren im Fr\xFChjahr (M\xE4rz\u2013April) oder Herbst in lockere, humusreiche Erde pflanzen. Pflanzabstand 25\u201330 cm, Krone knapp \xFCber der Erdoberfl\xE4che lassen.",
      "Pflegetipps\nRegelm\xE4ssig giessen, besonders w\xE4hrend Bl\xFCte und Fruchtentwicklung. Ausl\xE4ufer entfernen f\xFCr st\xE4rkere Fr\xFCchte. Nach der Ernte alte Bl\xE4tter auf 10 cm zur\xFCckschneiden.",
      "D\xFCngen\nIm Fr\xFChjahr mit Kompost oder Erdbeer-Langzeitd\xFCnger versorgen. Nicht \xFCberd\xFCngen \u2014 zu viel Stickstoff f\xF6rdert Bl\xE4tter auf Kosten der Fr\xFCchte.",
      "Ernte\nFr\xFCchte erst bei vollst\xE4ndiger Rotf\xE4rbung ernten (Juni\u2013Juli). T\xE4glich kontrollieren, reife Beeren sofort pfl\xFCcken um F\xE4ulnis zu vermeiden.",
      "\xDCberwinterung\nSehr winterhart bis \u221215 \xB0C. Bei starkem Frost im Topf mit Vlies oder Stroh sch\xFCtzen und an eine windgesch\xFCtzte Stelle stellen."
    ].join("\n\n");
  } else if (p.includes("befall") || p.includes("sch\xE4dling")) {
    mockText = imageBase64 ? "Es sind Anzeichen von Spinnmilbenbefall sichtbar: feine Gespinste unter den Bl\xE4ttern und gelbliche Verf\xE4rbungen. Sofortmassnahme: Pflanze isolieren und mit Neem-\xD6l-L\xF6sung bespr\xFChen. Wiederholung nach 5\u20137 Tagen empfohlen. Auf gute Bel\xFCftung achten." : "Basierend auf der Beschreibung deutet vieles auf Blattlausbefall hin. Unterseiten der Bl\xE4tter pr\xFCfen und befallene Triebe entfernen. Mit Schmierseifenl\xF6sung behandeln und nat\xFCrliche Fressfeinde (Marienk\xE4fer) f\xF6rdern.";
  } else if (p.includes("auff\xE4lligkeit") || p.includes("auffaelligkeit")) {
    mockText = imageBase64 ? "Die gelben Bl\xE4tter mit dunkleren Adern deuten auf Magnesiummangel hin. Empfehlung: mit Magnesiumsulfat-L\xF6sung (Bittersalz, 15 g/l) giessen. Bodenprobe empfohlen. Verbesserung sollte nach 1\u20132 Wochen sichtbar sein." : "Die beschriebene Auff\xE4lligkeit k\xF6nnte auf Staun\xE4sse oder Wurzelprobleme hinweisen. Erde auf Feuchte pr\xFCfen und ggf. Drainage verbessern. Falls die Symptome anhalten, Pflanze umpflanzen und Wurzeln inspizieren.";
  } else {
    mockText = imageBase64 ? "Die Pflanze sieht insgesamt gesund aus. Die Bl\xE4tter zeigen eine kr\xE4ftige Farbe ohne sichtbare Sch\xE4den. Ich empfehle, die Erde feucht aber nicht nass zu halten und auf ausreichende Sonneneinstrahlung zu achten. Keine unmittelbaren Massnahmen notwendig." : "Anfrage erhalten. F\xFCr eine genaue Analyse bitte ein Foto oder eine Beschreibung hinzuf\xFCgen.";
  }
  res.json({ text: mockText });
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are accepted"));
  }
});
app.post(
  "/api/upload",
  requirePassword,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No image provided" });
      return;
    }
    try {
      const buf = await sharp(req.file.buffer).resize(800, 800, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 60 }).toBuffer();
      res.json({
        base64: buf.toString("base64"),
        mimeType: "image/jpeg",
        sizeKB: Math.round(buf.length / 1024)
      });
    } catch (err) {
      console.error("[/api/upload] sharp error:", err);
      res.status(500).json({ error: "Image processing failed" });
    }
  }
);
if (process.env.NODE_ENV === "production") {
  const DIST = join(__dirname, "../dist");
  app.use((req, res, next) => {
    if (req.path === "/" || req.path.endsWith(".html") || req.path === "/sw.js" || req.path === "/registerSW.js") {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    }
    next();
  });
  app.use(express.static(DIST));
  app.get("*", (_req, res) => res.sendFile(join(DIST, "index.html")));
}
app.listen(PORT, () => {
  console.log(`
\u{1F331} Rooftop Planner API  \u2192  http://localhost:${PORT}`);
  console.log(`   Password gate         :  ${PW === "dev" ? "dev (default \u2014 set APP_PASSWORD to change)" : "***"}`);
  console.log(`   Claude AI             :  ${process.env.ANTHROPIC_API_KEY ? "enabled (Anthropic key set)" : "placeholder (set ANTHROPIC_API_KEY to enable)"}
`);
});
