# ReinoChess 🐲♟️

App PWA premium de ajedrez para niñas y niños de 5 años. Tematizada como un reino mágico, con Drako el dragón como coach virtual que guía paso a paso, narra en español mexicano y celebra cada logro.

100% client-side, sin backend, sin tracking, sin anuncios. Funciona offline después de la primera carga.

## Stack

- **Next.js 16** (App Router) + **TypeScript estricto**
- **Tailwind CSS v4** con paleta de reino (madera, oro, crema)
- **chess.js** para reglas del ajedrez
- **Stockfish 18 Lite** (single-thread WASM) en Web Worker para la IA
- **framer-motion** para animaciones (sprite layer absoluto con tracking de IDs estables)
- **Zustand** para estado (con persistencia en localStorage)
- **Web Speech API** (`es-MX`) para la voz de Drako
- **Web Audio API** para efectos sonoros sintetizados (sin assets)
- **PWA**: manifest + service worker (cache de stockfish.wasm y assets) → instalable y offline

## Cómo correr local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para usar desde otro dispositivo en tu WiFi:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Y abre `http://<tu-ip-local>:3000` desde el iPad/celular.

## Cómo desplegar

### Vercel (recomendado)

1. Sube el código a un repo de GitHub.
2. En Vercel, importa el repo. Detecta Next.js automáticamente.
3. Deploy → listo. No requiere variables de entorno.

`vercel.json` ya configura los headers correctos para `stockfish.wasm` y el service worker.

### Otros hostings

Cualquier hosting que soporte Next.js (Netlify, Cloudflare Pages) funciona. Asegúrate de servir `.wasm` con `Content-Type: application/wasm`.

## Estructura

```
app/
  page.tsx                 # Home con 6 cofres
  jugar/
    page.tsx               # Partida vs IA (selector de nivel + color)
    duo/page.tsx           # 2 jugadoras local
    libre/page.tsx         # Modo libre sin reglas
  tutorial/
    page.tsx               # Lista de 7 lecciones
    [lessonId]/page.tsx    # Lección guiada
  puzzles/
    page.tsx               # Lista de 30 puzzles con filtros
    [puzzleId]/page.tsx    # Puzzle individual
  minijuegos/
    page.tsx               # Lista de 6 mini-juegos
    [gameId]/page.tsx      # Selector de niveles + juego
  perfil/page.tsx          # Avatar, estrellas, medallas, progreso
  config/page.tsx          # Modo padres con candado matemático

components/
  board/                   # ChessBoard, Pieces SVG, HintArrow
  coach/                   # DrakoAvatar, SpeechBubble, CoachContext
  partida/                 # LevelSelector, ColorPicker, EndGameModal...
  tutorial/                # LessonRunner
  puzzles/                 # PuzzleRunner
  minigames/               # GoalBoard, MinigameRunner
  feedback/                # StarBurst, Confetti, TrophyModal
  layout/                  # AppShell, Providers, PWARegister

lib/
  chessEngine.ts           # Wrapper de chess.js (legalMoves, threats, etc.)
  stockfish/               # Engine wrapper + niveles (Pollito → Dragón)
  tutorial/lessons.ts      # 7 lecciones con guion ES-MX
  puzzles/catalog.json     # 30 puzzles validados
  minigames/games.ts       # 6 juegos × 5 niveles
  audio/speech.ts          # Coach TTS (es-MX)
  audio/sfx.ts             # Efectos sintetizados Web Audio API
  avatars.ts               # 8 avatares emoji para perfil

store/
  gameStore.ts             # Estado de partida libre
  partidaStore.ts          # Estado partida vs IA (stage machine)
  progressStore.ts         # Persistencia: lecciones, puzzles, mini-juegos, estrellas
  settingsStore.ts         # Voz, sfx, set de piezas, avatar, nombre

public/
  stockfish/               # stockfish.js + stockfish.wasm
  icon.svg                 # Icono PWA (Drako)
  manifest.json            # PWA manifest
  sw.js                    # Service worker

scripts/
  validate-puzzles.mjs     # Verifica con chess.js que los 30 puzzles sean válidos
```

## Niveles de IA

| Personaje | Stockfish skill | Profundidad | Movetime | Notas |
|-----------|-----------------|-------------|----------|-------|
| 🐤 Pollito | — | — | — | Movimiento al azar (no usa Stockfish) |
| 🐶 Cachorro | 3 | 2 | 300ms | Muy fácil |
| 🐺 Lobo | 8 | 4 | 600ms | Medio |
| 🦁 León | 14 | 6 | 1000ms | Difícil |
| 🐲 Dragón | 20 | 10 | 1800ms | Maestro (desbloquea con 50⭐) |

## Cómo añadir contenido

### Más puzzles

Edita [`lib/puzzles/catalog.json`](./lib/puzzles/catalog.json):

```json
{
  "id": "p031",
  "tema": "mate-en-1",
  "titulo": "Mi puzzle nuevo",
  "fen": "...",
  "lado": "blancas",
  "solucion": ["Qd8#"],
  "pista_voz": "Frase que dirá Drako como pista."
}
```

Después corre el validador:

```bash
node scripts/validate-puzzles.mjs
```

Verifica que el FEN es válido y que la solución da efectivamente jaque mate (o lo que indique el tema).

### Más lecciones del tutorial

Edita [`lib/tutorial/lessons.ts`](./lib/tutorial/lessons.ts). Cada lección es una secuencia de pasos:
- `narrate`: Drako narra y auto-avanza
- `tap-piece`: el niño debe tocar una casilla específica
- `make-move`: el niño debe hacer un movimiento de `from` a una de las casillas válidas en `to`

### Más niveles de mini-juegos

Edita [`lib/minigames/games.ts`](./lib/minigames/games.ts). Cada nivel define:
- `player`: pieza inicial y tipo
- `items`: monedas, antorchas, dragones, zanahorias a recoger
- `obstacles`: rocas, fuego, peones rivales
- `goal`: `collect-all` o `reach`
- `maxMoves`, `threeStarMoves`, `twoStarMoves`

### Cambiar la voz de Drako por audios pre-grabados

Edita [`lib/audio/speech.ts`](./lib/audio/speech.ts). Actualmente usa Web Speech API (TTS del sistema). Para reemplazar por audios MP3:

1. Coloca los archivos en `public/audio/voice/`
2. Modifica `SpeechCoach.speak()` para reproducir el archivo correspondiente con `<audio>` en lugar de utterances

## Comandos útiles

```bash
npm run dev                          # Dev server con Turbopack
npm run build                        # Build de producción
npm run start                        # Servidor de producción local
npm run lint                         # ESLint

node scripts/validate-puzzles.mjs    # Validar puzzles
```

## Roadmap futuro

- [ ] Audios pre-grabados con actor de voz mexicano (reemplazar TTS)
- [ ] Música de fondo del reino (toggle ya está en modo padres)
- [ ] Multijugador online (con Supabase + WebRTC)
- [ ] Más puzzles por dificultad
- [ ] Modo torneo entre niveles de IA
- [ ] Inglés y portugués

🐲 ¡Que el reino te dé buenos jaques!
