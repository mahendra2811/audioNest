# AudioNest — Production Build Specification (Claude Code Mega Prompt)

> **You are building a complete, production-ready web app from scratch. Follow this spec exactly. Build in the phase order in §20. Work autonomously — do not ask the user questions; where a detail is unspecified, choose the simplest robust option consistent with this document. After each phase, run `bun run build` and fix every type, lint, and runtime error before moving on. The app is NOT done until the build passes with zero errors, every tool works on a self-generated test file, and the Liquid Glass UI renders correctly in light mode.**

---

## 1. Mission

Build **AudioNest** — a mobile-first, **100% client-side** browser hub of audio tools. A user picks a tool, drops in a file, it is processed **entirely on their device** (nothing uploaded), and they download the result. The signature look is **Apple-style Liquid Glass** over a living orange-gold gradient.

**Prime directives:**
- **100% on-device.** No uploads, no backend, no accounts, no sign-up, no watermark, free. Files never leave the browser. This is the product's core promise and must be true and stated everywhere.
- **Honest copy.** Never claim "lossless" where a lossy step occurs (e.g. converting WAV→MP3); label lossy operations plainly.
- **24 tools ship in v1.** 4 more are "Coming soon" tiles (scaffold only — see §21).

---

## 2. Tech stack (use latest stable of each)

- **Next.js (App Router) + React + TypeScript** (strict). Package manager: **Bun**.
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI) + **clsx** + **tailwind-merge**.
- **Framer Motion** — tilt, parallax, hover, transitions (transform/opacity only).
- **lucide-react** — icons. **next-themes** — light (default) / dark.
- **Zustand** — app state (favourites, per-tool state).
- **Sonner** — toasts (top-center). **nextjs-toploader** — gradient route progress bar.
- **react-dropzone** — file input.

**Audio engine libraries:**
- **Web Audio API** (native) — `AudioContext`, `OfflineAudioContext`, `GainNode`, `BiquadFilterNode`, `ConvolverNode`, `AnalyserNode`, `AudioWorklet`.
- **@ffmpeg/ffmpeg** + **@ffmpeg/core** (ffmpeg.wasm, **single-threaded self-hosted core**) — conversion, export, filters, video. Lazy-load on first use.
- **wavesurfer.js** (v7) — waveform display + Regions plugin.
- **@soundtouchjs/audio-worklet** — pitch + tempo shifting (independent, no chipmunk effect).
- **@sapphi-red/web-noise-suppressor** — RNNoise ML noise suppression via AudioWorklet.
- **web-audio-beat-detector** — BPM detection.
- **music-metadata** (browser build) — read ID3/APE/iTunes/Vorbis tags.
- **browser-id3-writer** — write ID3v2 tags.
- **jszip** — bundle multi-file outputs (splitter).

**Infra/ops:**
- **@next/third-parties** (GA4 + GTM), **next-sitemap**, **Serwist** (PWA), **@sentry/nextjs** (env-gated).
- **Biome** (lint+format), **Husky + lint-staged**, **Vitest** + **React Testing Library**.
- Deploy: **Vercel** + **Cloudflare** CDN. Set **COOP/COEP headers** (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`) so SharedArrayBuffer/AudioWorklet/ffmpeg.wasm work. If a third-party script needs it, use `credentialless` for COEP.

**Before coding any library integration, check that library's current docs** — several (Mediabunny-style WebCodecs libs, wavesurfer v7, soundtouchjs audio-worklet, ffmpeg.wasm) have changed APIs; use the real current API, not assumptions.

---

## 3. The Liquid Glass design system — THIS IS THE IDENTITY, GET IT EXACT

Every card and panel is a slab of real refractive glass floating over a living orange-gold gradient. Build each glass element in these **6 layers, back to front:**

1. **REFRACTION** — the glass bends/distorts the gradient and content behind it. Implement with an **SVG filter**: `feTurbulence` (type `fractalNoise`, low `baseFrequency` ~0.008–0.02, 2–3 octaves) feeding `feDisplacementMap` on a backdrop layer, `scale` ~20–40px. Edges distort more than the center (like a thick beveled glass slab). The distortion must visibly warp the orange-gold blobs passing behind it.
2. **BLUR** — `backdrop-filter: blur()` on top of the refraction, so distant content reads frosted, near content clearer.
3. **TINT** — barely-there white/gold tint: heavy glass `bg-white/15`, medium `bg-white/10`, light (scrolled header) `bg-white/5`.
4. **SPECULAR EDGE** — a 1px inner border brightest at top-left fading to nothing at bottom-right (light catching the bevel), plus a second softer inner glow just inside it.
5. **CHROMATIC RIM (subtle)** — faint orange→gold color fringing on the extreme bevel edges (light splitting through glass).
6. **SHADOW** — soft, large, **warm orange-cast** drop shadow (not gray) so the slab clearly floats.

**Depth & motion (physically 3D):**
- **Background:** 3–4 large soft orange/gold blobs drifting and morphing slowly, heavily blurred — this is what the glass refracts; keep it alive but calm. Add ~4% film grain to kill banding.
- **Parallax:** blobs (far plane), glass slabs (mid plane), foreground content/icons (near plane) move at different speeds on scroll and subtly on pointer move.
- **Tilt:** glass cards tilt toward the cursor (max 6°). As a card tilts, the specular highlight slides across the surface and the refraction shifts (glass catching a moving light). Spring physics.
- **Hover:** featured cards lift, glass clears slightly (less blur), specular edge brightens, shadow deepens.
- **Active/hovered featured card:** a slowly rotating gradient border ring.

**Performance rules (NON-NEGOTIABLE):**
- ALL animation uses **only `transform`/`opacity`** (GPU-composited), never layout properties.
- `prefers-reduced-motion`: freeze blob drift, tilt, parallax, and refraction animation — glass stays static.
- **Mobile:** reduce displacement `scale` and blur radius, drop pointer-tilt (refraction static) — performance first.
- **While any tool is actively processing** (ffmpeg.wasm/WebCodecs/Worklet running): **freeze the refraction animation and blob drift, drop to a cheaper static blur**, then resume when done. Expose a global `useProcessingState` (Zustand) that the background/glass components subscribe to.

**Required design components:**
- `<GlassFilter />` — reusable SVG `<defs>` with the turbulence/displacement filters + chromatic offsets; mounted once in root layout. Provide filter IDs the glass components reference.
- `<GlassPanel />` / `<GlassCard />` — implements all 6 layers; props: `intensity` (`heavy`|`medium`|`light`), `tilt` (bool), `interactive` (bool, adds hover lift). Uses Framer Motion for tilt/hover.
- `<BlobBackground />` — animated orange/gold blobs + grain; subscribes to reduced-motion + processing state to freeze.
- `<GradientRing />` — rotating gradient border for the active featured card.

---

## 4. Design tokens

- **Brand gradient:** `#FF8C00` (orange) → `#FFD700` (gold), 135°. Used ONLY on: logo, primary buttons, progress rings, top-loader bar, hero accents, active tab/nav indicator. **Never on glass surfaces themselves.** Expose `.bg-brand` (gradient) and `.text-brand` (gradient-clipped text).
- **Font:** **Geist** (body) + **Geist Mono** for ALL numerics — BPM, file size, duration, sample rate, bitrate, dB, LUFS — via `next/font`.
- **Radius:** `rounded-3xl` on major panels/glass slabs, `rounded-2xl` on cards.
- **Light (showcase — fully polished):** bg `#FFFBF5`, surface `#FFFFFF`, text `#1A1208`, muted `#7A6A50`.
- **Dark (clean inversion, same glass system):** bg `#0F0A00`, surface `#1A1200`, text `#FFF8ED`, muted `#B8A77F`.
- **Theme default:** light. Dark available via next-themes; follow system when set to dark, but light is primary and gets the polish.

---

## 5. Logo (embed verbatim as `components/brand/Logo.tsx`; refine later, keep concept + gradient)

A gradient badge with a white audio-waveform mark.

```svg
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AudioNest">
  <defs>
    <linearGradient id="anGold" x1="3" y1="3" x2="45" y2="45" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF8C00"/><stop offset="1" stop-color="#FFD700"/>
    </linearGradient>
  </defs>
  <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#anGold)"/>
  <g fill="#fff">
    <rect x="13" y="21" width="3.2" height="6" rx="1.6"/>
    <rect x="18.4" y="17" width="3.2" height="14" rx="1.6"/>
    <rect x="23.8" y="12" width="3.2" height="24" rx="1.6"/>
    <rect x="29.2" y="17" width="3.2" height="14" rx="1.6"/>
    <rect x="34.6" y="21" width="3.2" height="6" rx="1.6"/>
  </g>
</svg>
```
Wordmark: badge + "Audio" (text) + "Nest" (`.text-brand`). Generate favicon, apple-touch-icon, and PWA icons (192/512 + maskable) from this badge.

---

## 6. Folder structure

```
audionest/
├─ .claude/                      # see §18
├─ app/
│  ├─ layout.tsx                 # fonts, ThemeProvider, GlassFilter, BlobBackground, TopLoader, Toaster, Analytics, nav shells
│  ├─ page.tsx                   # Home
│  ├─ globals.css                # Tailwind v4 + tokens + .bg-brand/.text-brand + glass utilities
│  ├─ opengraph-image.tsx        # dynamic OG (gradient template), reused per route
│  ├─ icon.tsx / apple-icon.tsx  # from logo
│  ├─ manifest.ts                # PWA manifest
│  ├─ sitemap.ts / robots.ts
│  ├─ not-found.tsx / error.tsx / global-error.tsx
│  ├─ how-it-works/page.tsx
│  ├─ about/page.tsx
│  ├─ privacy-policy/page.tsx
│  ├─ terms/page.tsx
│  ├─ contact/page.tsx
│  └─ (tools)/                   # route group; one folder per tool (slugs in §10)
│     ├─ audio-cutter/page.tsx
│     ├─ audio-joiner/page.tsx
│     └─ ... (all 24)
├─ components/
│  ├─ brand/Logo.tsx, Wordmark.tsx
│  ├─ glass/GlassFilter.tsx, GlassPanel.tsx, GlassCard.tsx, BlobBackground.tsx, GradientRing.tsx
│  ├─ layout/Header.tsx, Footer.tsx, BottomNav.tsx, DesktopSidebar.tsx, ThemeToggle.tsx, AppSplash.tsx
│  ├─ tool/                      # SHARED tool scaffold (every tool reuses this)
│  │  ├─ ToolShell.tsx           # layout: header(title+fav heart) + dropzone/controls/result slots + related tools
│  │  ├─ Dropzone.tsx            # react-dropzone, validation, glass styling
│  │  ├─ FileMeta.tsx            # detected format/duration/size/etc.
│  │  ├─ ProgressRing.tsx        # circular gradient % + step label + cancel
│  │  ├─ AudioPlayer.tsx         # play/seek; before/after compare variant
│  │  ├─ ResultPanel.tsx         # output stats + download (+ download-all for zip)
│  │  ├─ ErrorCard.tsx           # error matrix mapping (see §13)
│  │  └─ WaveformView.tsx        # wavesurfer wrapper (+ Regions)
│  ├─ home/Hero.tsx, FeaturedGrid.tsx, CategorySection.tsx, TrustStrip.tsx, ComingSoonGrid.tsx
│  ├─ ads/AdSlot.tsx             # renders null unless ads enabled
│  └─ ui/                        # shadcn components
├─ lib/
│  ├─ config/site.ts             # env -> typed site config
│  ├─ config/flags.ts            # feature flags (no-op if env missing)
│  ├─ config/tools.ts            # TOOL REGISTRY (single source of truth — see §8)
│  ├─ audio/
│  │  ├─ types.ts                # AudioMeta, ToolResult, Progress, etc.
│  │  ├─ context.ts              # shared AudioContext/OfflineAudioContext helpers
│  │  ├─ decode.ts               # File -> AudioBuffer (with large-file guards)
│  │  ├─ encode.ts               # AudioBuffer/Blob -> MP3/WAV/etc via ffmpeg.wasm
│  │  ├─ ffmpeg.ts               # lazy ffmpeg.wasm loader + exec helper + progress
│  │  ├─ worklets/               # noise-suppressor, soundtouch registration
│  │  ├─ worker.ts               # Web Worker host for heavy ops
│  │  └─ tools/                  # one module per tool's core logic (pure-ish, testable)
│  │     ├─ cut.ts, join.ts, split.ts, convert.ts, video-to-audio.ts,
│  │     ├─ photo-to-video.ts, denoise.ts, info.ts, volume.ts, normalize.ts,
│  │     ├─ bass.ts, loudness.ts, compress.ts, silence.ts, reverse.ts,
│  │     ├─ reverb.ts, speed.ts, pitch.ts, stereo-to-mono.ts, mono-to-stereo.ts,
│  │     └─ bpm.ts, id3.ts, strip-metadata.ts, loop.ts
│  ├─ store/favourites.ts        # Zustand + localStorage
│  ├─ store/processing.ts        # global "is processing" flag (freezes animations)
│  ├─ analytics/                 # GA/GTM + track() helper (no-op if disabled)
│  ├─ seo/                       # metadata + JSON-LD builders
│  ├─ strings.ts                 # ALL UI copy centralized (English; i18n-ready)
│  └─ utils/                     # formatBytes, formatDuration, formatLUFS, cn, etc.
├─ public/
│  ├─ ffmpeg/                    # self-hosted ffmpeg core (.js/.wasm)
│  ├─ ir/                        # reverb impulse responses: room.wav, hall.wav, church.wav, cave.wav, studio.wav, plate.wav (~500KB–1MB total)
│  └─ icons/                     # generated app icons
├─ tests/                        # vitest unit tests for lib/audio/tools logic
├─ .env.example
├─ next.config.ts                # COOP/COEP headers, serwist, sentry wrapper
├─ biome.json, tsconfig.json, package.json
└─ README.md
```

---

## 7. Environment variables (`.env.example`)

**Golden rule: every integration is independently optional. If its env key is absent/empty, that feature silently disables itself and the app works perfectly without it — no crashes, no console errors.**

```
NEXT_PUBLIC_SITE_NAME=AudioNest
NEXT_PUBLIC_SITE_URL=https://audionest.app
NEXT_PUBLIC_CONTACT_EMAIL=hello@audionest.app

NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GSC_VERIFICATION=

NEXT_PUBLIC_ADS_ENABLED=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=

NEXT_PUBLIC_FORMSPREE_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 8. Tool registry (single source of truth)

`lib/config/tools.ts` exports a typed `Tool[]`. The home grid, category sections, sidebar, favourites, SEO, and routing all read from it. Each tool:

```ts
type Tool = {
  slug: string;            // url + folder name
  name: string;            // "Audio Cutter"
  benefit: string;         // one-line card text
  icon: string;            // lucide icon name
  category: 'cut' | 'convert' | 'volume' | 'clean' | 'effects' | 'channels' | 'analyze' | 'metadata' | 'create';
  featured: boolean;       // appears on home featured grid (the 8)
  status: 'live' | 'soon';
  engine: 'webaudio' | 'ffmpeg' | 'mixed';
  accepts: string[];       // input mime/ext groups
  output: 'mp3' | 'zip' | 'mp4' | 'display' | 'same'; // display = analysis only, no download
  seo: { title: string; description: string };
};
```

The 8 `featured: true` tools: Audio Cutter, Audio Joiner, Audio Splitter, Audio Converter, Video to Audio, Photo+Audio→Video, Noise Remover, Audio Info. All 24 live tools + the 4 `status:'soon'` are registered.

---

## 9. Audio engine architecture

Two engine paths, both invoked through a Web Worker so the UI (and glass animation) stays smooth:

- **Engine A — Web Audio:** `File → decode.ts (AudioBuffer) → process (OfflineAudioContext graph / AudioWorklet) → encode.ts (MP3 via ffmpeg.wasm) → Blob`. Used by: volume, bass, reverb, speed, pitch, reverse, loudness (analyze), loop, denoise (Worklet), cut (slice).
- **Engine B — ffmpeg.wasm:** `File → ffmpeg.writeFile → ffmpeg.exec([...]) → ffmpeg.readFile → Blob`. Used by: convert, video-to-audio, photo→video, splitter, normalize (loudnorm), compress, silence remove, stereo↔mono, strip-metadata.

Shared rules:
- **Decode guards:** very large/long files can exhaust memory. For waveform display of big files use **pre-decoded peaks** (don't fully decode for display). Enforce input limits: **500 MB / 2 hours** — reject with a clear toast before processing.
- **Progress:** real progress from ffmpeg (`on('progress')`) or from frame/sample counts; never fake. Drive `ProgressRing`. Support cancellation (AbortSignal → terminate worker / `ffmpeg.terminate()`), and on cancel free buffers and reset the processing flag.
- **Processing flag:** wrap every tool run so it sets `processing.start()` / `processing.end()` (freezes background + glass animation per §3).
- **Output default MP3** (libmp3lame) unless the tool says otherwise; offer WAV/FLAC/OGG where the converter applies.
- Each `lib/audio/tools/*.ts` exposes a pure-ish function (`run(input, opts, onProgress, signal): Promise<ToolResult>`) so logic is unit-testable independent of UI.

---

## 10. Per-tool specifications (implement ALL 24)

Format: **Engine · Libraries · Input · Output · Flow · States · Edge cases.** Every tool page is built from the shared `ToolShell` (§13).

### Cut & Edit
**1. Audio Cutter** — slug `audio-cutter` · Engine mixed · `wavesurfer.js`(+Regions), `@ffmpeg/ffmpeg` · In: audio · Out: mp3.
Flow: upload → render waveform → drag region handles (start/end) → optional Fade In/Fade Out toggles → "Cut" slices AudioBuffer at timestamps, applies GainNode fade ramps → encode → download. States: skeleton waveform while decoding → interactive waveform with orange region + handles → processing ring → before/after player + download. Edge: >100 MB use pre-decoded peaks; warn on >2 h.

**2. Audio Joiner** — slug `audio-joiner` · Engine ffmpeg · `@ffmpeg/ffmpeg`, mini `wavesurfer.js` previews · In: 2–10 audio · Out: mp3.
Flow: upload multiple → drag to reorder → crossfade slider (0–5 s, default 1 s) → ffmpeg `concat` + `acrossfade` → download. States: ordered file list with mini-waveform thumbnails → processing → full-waveform preview + download. Edge: auto-resample to 44.1 kHz, auto-downmix to stereo for mismatches.

**3. Audio Splitter** — slug `audio-splitter` · Engine ffmpeg · `@ffmpeg/ffmpeg`, `jszip` · In: audio · Out: zip.
Flow: upload (+ file info) → choose mode: by N equal parts OR every X seconds → ffmpeg `-f segment -segment_time -reset_timestamps 1` → zip of MP3s. States: upload → options → processing → list of playable segments + "Download all (zip)".

**4. Silence Remover** — slug `silence-remover` · Engine ffmpeg · `@ffmpeg/ffmpeg`, `wavesurfer.js` · In: audio · Out: mp3.
Flow: upload → waveform highlights detected silent regions → threshold slider (default −30 dB) + min duration (default 0.5 s) update highlights → ffmpeg `silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-30dB` → show time removed ("Removed 4m12s") → download.

**5. Audio Reverser** — slug `audio-reverser` · Engine webaudio · `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: upload → "Reverse" reverses each channel's Float32Array → preview → encode → download. States: instant for short files (no spinner); ring for long.

### Convert
**6. Audio Converter** — slug `audio-converter` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: any audio · Out: mp3/wav/flac/aac/ogg/m4a/opus.
Flow: upload (+ detected format) → pick target format (button grid, active highlighted) + optional bitrate slider for lossy → convert → download. Edge: WAV/FLAC→MP3 shows a "this step is lossy" note; unsupported input → ffmpeg decode handles it.

**7. Video to Audio** — slug `video-to-audio` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: mp4/mov/mkv/avi/webm · Out: mp3 (wav/aac options).
Flow: upload → show video info + grabbed thumbnail (canvas) → pick format → ffmpeg `-vn -c:a copy` if stream already MP3/AAC else `-vn -c:a libmp3lame` → download.

**8. Photo + Audio → Video** — slug `photo-audio-to-video` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: 1 image (jpg/png/webp) + 1 audio · Out: mp4.
Flow: dual dropzones → preview image thumb + audio waveform + duration → ffmpeg `-loop 1 -i img -i audio -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest` (scale image to even dimensions) → video player + download. Use case: lyric/podcast/status videos.

### Clean & Compress
**9. Noise Remover** — slug `noise-remover` · Engine webaudio (Worklet) · `@sapphi-red/web-noise-suppressor`, `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: upload → decode → route through RNNoise `NoiseSuppressionWorkletNode` in OfflineAudioContext → encode cleaned buffer → before/after compare → download. States: upload → "Cleaning noise…" → before/after toggle player + download. Edge: voice-optimized — on music input show toast "Best for voice recordings — results on music may vary."

**10. Audio Compressor** — slug `audio-compressor` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: audio · Out: mp3.
Flow: upload (+ current size/bitrate) → target: size slider (live est. "~2.4 MB at 96 kbps") OR bitrate picker (32/64/96/128 kbps) → re-encode → before/after size comparison + download.

### Volume & Loudness
**11. Volume Booster** — slug `volume-booster` · Engine webaudio · `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: upload → waveform + current peak → gain slider (−20 to +20 dB, default 0) with live preview → "Apply" renders via OfflineAudioContext + GainNode → download. (Clamp/limit to avoid clipping; optional soft-limit.)

**12. Audio Normalizer** — slug `audio-normalizer` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: audio · Out: mp3.
Flow: upload → measure loudness (show current LUFS) → pick target: Streaming −14 / Podcast −16 / Broadcast −23 (or Peak −0.1 dBFS) → ffmpeg `loudnorm=I=<t>:TP=-1.5:LRA=11` → show current vs target → download.

**13. Bass Booster** — slug `bass-booster` · Engine webaudio · `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: upload → preview → bass slider (0 to +12 dB, BiquadFilter lowshelf ~100 Hz) with live preview → "Apply" renders → download.

**14. Loudness Meter** — slug `loudness-meter` · Engine webaudio · native (AnalyserNode + LUFS calc) · In: audio · Out: display.
Flow: upload → decode → compute Peak (dBFS), RMS, Integrated LUFS (EBU R128), LRA, True Peak → display with color-coded bar meters (green/amber/red). No download.

### Effects
**15. Reverb Adder** — slug `reverb-adder` · Engine webaudio · `@ffmpeg/ffmpeg`(export); IR WAVs in `/public/ir` · In: audio · Out: mp3.
Flow: upload → dry preview → pick preset (Room/Hall/Church/Cave/Studio/Plate) + wet/dry slider → ConvolverNode(IR) + GainNode wet/dry in OfflineAudioContext → live preview → "Apply" → download.

**16. Speed Changer** — slug `speed-changer` · Engine webaudio (Worklet) · `@soundtouchjs/audio-worklet`, `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: upload → speed slider (0.25×–4×) with **maintain-pitch on by default** → live preview via SoundTouch worklet → "Apply + Download" renders via OfflineAudioContext → download. (Do NOT use `playbackRate` — it changes pitch.)

**17. Pitch Shifter** — slug `pitch-shifter` · Engine webaudio (Worklet) · `@soundtouchjs/audio-worklet`, `@ffmpeg/ffmpeg`(export) · In: audio · Out: mp3.
Flow: same as Speed Changer but pitch slider in semitones (−12 to +12), tempo fixed at 1×.

### Channels
**18. Stereo to Mono** — slug `stereo-to-mono` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: stereo audio · Out: mp3.
Flow: upload → one-click → ffmpeg `-ac 1` (or `pan=mono|c0=.5*c0+.5*c1`) → show before/after size (~half) → download. No settings.

**19. Mono to Stereo** — slug `mono-to-stereo` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: mono audio · Out: mp3.
Flow: upload → one-click → ffmpeg `-ac 2` (duplicate channel) → download.

### Analyze
**20. BPM Detector** — slug `bpm-detector` · Engine webaudio · `web-audio-beat-detector` · In: audio · Out: display.
Flow: upload → decode → `analyze(audioBuffer)` → large BPM display + note. Edge: ambient/classical → "Beat not detected clearly." No download.

### Metadata
**21. ID3 Tag Editor** — slug `id3-tag-editor` · Engine n/a · `music-metadata`(read), `browser-id3-writer`(write) · In: mp3 · Out: mp3.
Flow: upload → instantly read + prefill form (Title, Artist, Album, Year, Genre, Track #, Comment) + current cover art (option to upload new image) → edit → "Save Tags" writes ID3v2 into the file buffer → download updated MP3.

**22. Metadata Remover** — slug `metadata-remover` · Engine ffmpeg · `@ffmpeg/ffmpeg` · In: audio · Out: mp3.
Flow: upload → show all current metadata; **highlight GPS/location and device info if present** (the privacy hook) → "Remove All Metadata" → ffmpeg `-map_metadata -1 -c:a copy` → "Removed N fields" → download clean file.

### Create
**23. Loop Maker** — slug `loop-maker` · Engine webaudio · `@ffmpeg/ffmpeg`(export), `wavesurfer.js` · In: short audio · Out: mp3.
Flow: upload → waveform + duration → loops slider (2–50×) + optional gap (0–3 s) → "Preview" plays loop → "Export" renders N concatenated copies via OfflineAudioContext → show output duration ("10 s × 10 = 1m40s") → download.

**24. Audio Info** — slug `audio-info` · Engine n/a · `music-metadata` + Web Audio decode · In: audio · Out: display.
Flow: upload → parse instantly → info card: format, codec, bitrate, sample rate, channels, duration, size, ID3 tags, cover art (if any), optional quick BPM. No download; usually no spinner.

---

## 11. Navigation

- **Mobile — bottom nav (Instagram-style, 4 tabs, glass with brand-gradient active indicator):** **Home** (hero + 8 featured), **Tools** (all 24 by category), **Favourites** (saved tools grid), **More** (theme toggle, all categories, coming-soon list, About, Privacy, Terms, Contact). Bottom nav stays visible on tool pages (Option A — tools are not full-screen takeovers).
- **Desktop — different:** sticky top **Header** (logo+wordmark, links: Tools/How it works/About/Contact, ThemeToggle) + a left **DesktopSidebar** on `/tools` and tool pages listing all categories for quick switching.
- `nextjs-toploader` (brand gradient) under the header on every navigation. `AppSplash` (logo + gradient shimmer) on first mount only.

---

## 12. Favourites

- A heart icon (top corner of every tool page via `ToolShell`, and on cards) toggles favourite.
- Stored in **localStorage** via Zustand (`lib/store/favourites.ts`); no limit; persists across sessions; no account.
- Favourites tab/section renders saved tools as a glass-card grid; empty state invites the user to explore tools.

---

## 13. Shared tool-page contract (`ToolShell`)

Every tool page composes the same scaffold so they're consistent and fast to build:
`Breadcrumb + H1(tool name) + favourite heart` → `Dropzone` (or dual dropzone for photo→video) with input validation + the 500 MB/2 h limit toast → tool-specific **controls** (sliders/toggles/pickers per §10) → primary **Process** button (brand gradient) → `ProgressRing` (live %, step label, Cancel) → `ResultPanel` (`AudioPlayer`/before-after, output stats, Download or Download-all) → on failure `ErrorCard`. Below: short "how this tool works" + 3–4 **related tools** (from registry) + an `AdSlot` (renders null while ads disabled).

**Error matrix (map error code → friendly copy + fallback):** `UNSUPPORTED_BROWSER` (suggest Chrome/Safari), `UNSUPPORTED_FORMAT`, `TOO_LARGE`/`TOO_LONG` (limit toast at selection), `OOM` (auto-retry smaller where possible, else "try a shorter clip"), `DECODE_FAILED`/`PROCESS_FAILED` (retry button). All surfaced via Sonner + inline `ErrorCard`, logged to Sentry if enabled. Skeleton/shimmer only if a step exceeds ~300 ms.

---

## 14. Pages (~26) + copy

Use real copy (warm, honest); store all strings in `lib/strings.ts`. Each page: Metadata API title/description, canonical, OG image; tool pages add `SoftwareApplication` + `FAQPage` JSON-LD, site-wide `Organization`.

- **`/` Home:** Hero (one hero-scale liquid-glass panel with a glowing refracted waveform/orb; H1 **"Every audio tool. Right in your browser."**; sub **"Cut, convert, clean, and create — free, private, and 100% on your device. Nothing is ever uploaded."**; CTAs "Explore tools" + "How it works") → `FeaturedGrid` (8 liquid-glass cards: icon, title, benefit, `private · no upload` badge) → `CategorySection`s for the other 16 (medium glass) → `TrustStrip` (100% Free · No Upload · No Sign-up · Works on Mobile) → `ComingSoonGrid` (locked tiles: Vocal Remover, Beat Sequencer, Clip Timeline, Stem Splitter; tap → toast "Coming soon") → Footer.
- **`/tools`** (desktop sidebar + grid of all tools by category; mobile = Tools tab).
- **`/how-it-works`:** how on-device processing works (upload → process in your browser → download), why it's private (files never leave the device), honest note that converting between formats can be lossy, and that AudioNest is free with no watermark.
- **`/about`:** AudioNest is a free, privacy-first audio toolkit that runs entirely in your browser, with more tools coming.
- **`/privacy-policy`** *(template — README must tell the owner to have it reviewed):* emphasize **no audio leaves the device / nothing uploaded / no accounts**; analytics & cookies only **if enabled**; contact-form data only **if Formspree enabled**; write conditionally so it's accurate whether or not analytics/ads are on.
- **`/terms`** *(template — review before relying on it):* free service, as-is/no warranty, acceptable use, IP, liability limit, changes, contact.
- **`/contact`:** form (name/email/message). If `NEXT_PUBLIC_FORMSPREE_ID` set → fetch POST to Formspree; else render a `mailto:` link. Result via Sonner. (No `<form>` server action needed.)
- **`not-found` / `error`:** branded, gradient accent, link home.

---

## 15. Analytics, ads, SEO (all env-gated)

- **GA4 + GTM** via `@next/third-parties/google`, mounted only if their env IDs exist. `track(event, params)` helper (no-op if disabled): `tool_opened`, `file_selected`, `process_started`, `process_succeeded`, `process_failed`, `downloaded`, `favourited`.
- **Search Console:** inject verification `<meta>` from env if present; generate + submit `sitemap.xml` (next-sitemap) + `robots.txt`.
- **AdSense:** `AdSlot` renders nothing and the script doesn't load until `flags.adsEnabled` (env `true` + client id). Place AdSlots non-intrusively (below tool content, between home sections). Build now, off now.
- **SEO:** every tool gets a keyword-true title/description and JSON-LD; per-page dynamic `opengraph-image` on the gradient template.

---

## 16. PWA

Serwist service worker: precache the shell + lazy-cache static assets (incl. ffmpeg core + IR files); app loads and runs offline (processing is on-device). `manifest.ts`: name/short_name from config, brand `theme_color`/`background_color`, icons (192/512 + maskable), `display: standalone`, `start_url: '/'`. Installable on Android/iOS/desktop with branded splash.

---

## 17. Accessibility & performance

WCAG-AA contrast both themes; full keyboard nav; visible focus rings; aria on dropzone/sliders/progress/toggles/tabs; `prefers-reduced-motion` honored (freezes glass motion). Targets: Lighthouse ≥90 on marketing pages; lazy-load ffmpeg.wasm/worklets/heavy libs; all animation transform/opacity; never block the main thread (workers); first paint fast despite the glass.

---

## 18. `.claude` folder

```
.claude/
├─ CLAUDE.md           # project overview, full stack, folder map, design-system summary (the 6 glass layers + perf rules), tool-registry pattern, env + no-op rule, coding conventions, definition of done
├─ commands/
│  ├─ add-tool.md      # slash command: scaffold a new tool (registry entry + route from ToolShell + lib/audio/tools module + test)
│  ├─ new-page.md      # slash command: add a page with metadata + OG
│  └─ run-checks.md    # slash command: bun run build + biome + vitest, report failures
└─ settings.json       # Claude Code project settings (permissions, formatting)
```
`CLAUDE.md` must let a fresh session continue work without re-reading this whole spec: it summarizes the architecture, the Liquid Glass layer recipe + performance freeze rule, the tool registry contract, and the definition of done.

---

## 19. Definition of done (all must pass)

1. `bun install`, `bun run build` — zero TS/lint/build errors; dev runs clean.
2. With an **empty `.env`**: full app works — no analytics, no ads, contact falls back to mailto, no console errors.
3. **Every one of the 24 tools works end-to-end** on a self-generated test file (generate test audio/video/image with ffmpeg if none exists), produces a correct downloadable output (or correct display for analysis tools), shows real progress, and handles cancel.
4. Liquid Glass renders correctly in **light mode** (refraction visibly warps the blobs; specular edge; warm shadow), inverts cleanly in dark; motion freezes under `prefers-reduced-motion` and **while processing**.
5. Mobile bottom nav (4 tabs) + desktop top-nav+sidebar both work; favourites persist across reloads.
6. Works in Chrome (desktop+Android) and Safari; graceful fallback/messages where a browser lacks a capability.
7. PWA installable; Lighthouse perf/PWA pass; no layout-thrash animations.
8. Unit tests for `lib/audio/tools/*` core logic pass.
9. README documents env vars + no-op rule, local dev, COOP/COEP headers, and Vercel deploy.

Build autonomously and fix until all the above hold.

---

## 20. Build order (do in sequence, verifying each)

1. **Scaffold:** Next.js + TS + Tailwind v4 + Biome + Husky; `next.config.ts` (COOP/COEP); env/config/flags; design tokens + globals; Logo.
2. **Liquid Glass system:** `GlassFilter`, `GlassPanel`/`GlassCard`, `BlobBackground`, `GradientRing` — get the 6-layer look right in light mode first, with tilt/parallax/hover and the reduced-motion + processing freeze hooks. This is the make-or-break visual; do it before pages.
3. **Shell & nav:** root layout, Header, Footer, mobile BottomNav (4 tabs), DesktopSidebar, ThemeToggle, AppSplash, toploader, Sonner.
4. **Tool registry** (`lib/config/tools.ts`) with all 24 + 4 soon.
5. **Shared audio core:** `context/decode/encode/ffmpeg/worker` + worklet registration + `ToolShell`, `Dropzone`, `ProgressRing`, `AudioPlayer`, `ResultPanel`, `ErrorCard`, `WaveformView`. Processing-flag + favourites stores.
6. **Reference tools first (prove the pattern):** Audio Cutter, Audio Converter, Audio Info — one ffmpeg, one mixed/waveform, one analysis. Get the full flow + states + error handling perfect.
7. **All remaining tools:** implement every other tool from §10, one at a time, each with its `lib/audio/tools` module + unit test + page. Never leave a tool half-done.
8. **Home + pages** with real copy (§14); **analytics/ads/SEO** (§15) env-gated; **PWA** (§16).
9. **A11y + perf pass** (§17); QA against §19; write README + `.claude/CLAUDE.md`; final `bun run build`.

---

## 21. v1.1 roadmap (DO NOT build — register as `status:'soon'` tiles + leave TODOs)

The registry + ToolShell + worker engine must make these additive:
- **Vocal Remover** & **Stem Splitter** — on-device source separation (Demucs/Spleeter-class ONNX via WebGPU; ~50–200 MB model on first use; show download progress).
- **Beat Sequencer** — grid + BPM + sound placement, export (Tone.js).
- **Clip Timeline / Song Builder** — arrange clips on a timeline, export.
- **Server heavy-tier** — optional native-FFmpeg worker host for 4K/huge/long files that exceed the browser; opt-in upload with explicit privacy notice.
- **i18n (Hindi)** — all strings already centralized in `lib/strings.ts` for a later drop-in.

*End of specification.*
