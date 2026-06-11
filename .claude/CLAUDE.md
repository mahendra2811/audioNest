# AudioNest — Project Guide for Claude Code

## What this is
AudioNest is a 100% client-side, browser-based audio tools hub built with Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind v4, and Framer Motion. All 24 audio tools run entirely in the user's browser using ffmpeg.wasm and the Web Audio API. Nothing is ever uploaded to a server.

## Commands
```bash
bun install          # install deps
bun run dev          # start dev server (Turbopack)
bun run build        # production build — must pass with zero errors
bun run lint         # Biome lint
bun run type-check   # tsc --noEmit
```

## Architecture

### Tool pages
All tool pages live in `app/(tools)/[slug]/page.tsx`. The route group `(tools)` removes the `tools/` prefix from URLs so `/audio-cutter` not `/tools/audio-cutter`.

Pattern: `'use client'` → useState for file/progress/result/error → lazy `import()` of heavy tool module → `ToolShell` wrapper → `Dropzone` → processing → `ResultPanel` + `ErrorCard`.

### Audio logic modules
All in `lib/audio/tools/[name].ts`. Each exports a `run*` async function. Never import ffmpeg.wasm at module load time — always use dynamic `import()` inside the run function.

### ffmpeg.wasm
- `lib/audio/ffmpeg.ts` — lazy singleton, loads from `/public/ffmpeg/` with CDN fallback
- **Critical**: `ffmpegExec` returns `Uint8Array`. Its `.buffer` is `ArrayBufferLike`. Always cast: `new Blob([(output as Uint8Array).buffer as ArrayBuffer], { type })`
- COOP/COEP headers are required for SharedArrayBuffer — set in `next.config.ts`

### Glass design system
6-layer Liquid Glass: REFRACTION (SVG filter) → BLUR (backdrop-filter) → TINT (bg-white/15) → SPECULAR EDGE (inset box-shadow) → CHROMATIC RIM (gradient overlay) → SHADOW (warm orange drop-shadow).

Components: `GlassPanel` (full 6-layer tilt), `GlassCard` (simplified, no tilt), `GlassFilter` (SVG `<defs>`, mounted once in layout), `BlobBackground` (canvas 2D animated blobs).

### Stores
- `lib/store/processing.ts` — Zustand store, `useProcessingState`. Freezes blob animations while a tool is processing. Call `start()` before, `end()` in finally.
- `lib/store/favourites.ts` — Zustand + localStorage, `useFavourites`. Persists tool slugs.

### Tool registry
`lib/config/tools.ts` — complete definition of all 24 live tools + 4 "soon" tools. Exports `tools`, `liveTools`, `featuredTools`, `soonTools`, `CATEGORIES`, `getToolBySlug`, `getRelatedTools`.

## Environment variables
All optional — app must work with empty `.env`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (default: https://audionest.app) |
| `NEXT_PUBLIC_SITE_NAME` | Site name (default: AudioNest) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact email (default: hello@audionest.app) |
| `NEXT_PUBLIC_FORMSPREE_ID` | Formspree form ID; if absent, contact page shows mailto |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID; if absent, no analytics |
| `NEXT_PUBLIC_ADSENSE_ID` | AdSense publisher ID; if absent, no ads shown |

## COOP/COEP Headers
ffmpeg.wasm requires `SharedArrayBuffer`, which requires:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: cross-origin
```
These are set in `next.config.ts` and must stay in place. Removing them breaks ffmpeg.wasm.

## Turbopack
Next.js 16 uses Turbopack by default. Do not add `webpack()` configuration to `next.config.ts` — it will conflict. Use `turbopack: {}` in the config instead.

## Adding a new tool
1. Add the tool definition to `lib/config/tools.ts`
2. Create `lib/audio/tools/[name].ts` with the `run*` function
3. Create `app/(tools)/[slug]/page.tsx` using the standard page pattern
4. Run `bun run build` to verify zero errors
