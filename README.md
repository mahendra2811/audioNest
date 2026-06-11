<div align="center">

# 🎵 AudioNest

**Every audio tool. Right in your browser.**

Free · Private · No upload · No account · Works offline

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

[Live Demo](https://audionest.app) · [Report a Bug](https://github.com/your-org/audionest/issues) · [Request a Tool](https://github.com/your-org/audionest/issues)

</div>

---

## What is AudioNest?

AudioNest is a browser-based audio toolkit. It runs **entirely on your device** — using WebAssembly (ffmpeg.wasm) and the Web Audio API — so your files are never uploaded to any server. Close the tab and the files are gone. No watermark, no account, no limits.

### 24 tools included

| Category | Tools |
|---|---|
| **Cut & Edit** | Audio Cutter, Audio Joiner, Audio Splitter, Silence Remover, Audio Reverser |
| **Convert** | Audio Converter, Video to Audio, Photo + Audio → Video |
| **Clean & Compress** | Noise Remover, Audio Compressor, Audio Normalizer |
| **Volume & Loudness** | Volume Booster, Bass Booster, Loudness Meter |
| **Effects** | Reverb Adder, Speed Changer, Pitch Shifter |
| **Channels** | Stereo to Mono, Mono to Stereo |
| **Analyze** | BPM Detector, Audio Info |
| **Metadata** | ID3 Tag Editor, Metadata Remover |
| **Create** | Loop Maker |

> **Coming soon:** Vocal Remover, Stem Splitter, Beat Sequencer, Clip Timeline

---

## Screenshots

> _Add screenshots here once you have a live URL or local screenshots._

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) v1.x (recommended) or Node.js 20+

### Install and run

```bash
# Clone
git clone https://github.com/your-org/audionest.git
cd audionest

# Install dependencies
bun install

# Start dev server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
bun run build        # Production build (must pass with 0 errors)
bun run start        # Serve production build locally
bun run lint         # Biome lint
bun run test         # Unit tests (Vitest)
bun run test:ui      # Tests with interactive UI
```

---

## Environment variables

All variables are optional. The app works fully with an empty `.env` — no analytics, no ads, contact form falls back to a `mailto:` link.

Copy the example file to get started:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://audionest.app` | Canonical URL for SEO, OG images, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | `AudioNest` | Site name in metadata |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@audionest.app` | Email shown on contact page (mailto fallback) |
| `NEXT_PUBLIC_FORMSPREE_ID` | _(none)_ | [Formspree](https://formspree.io) form ID — enables the contact form |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | _(none)_ | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_GTM_ID` | _(none)_ | Google Tag Manager container ID |
| `NEXT_PUBLIC_ADS_ENABLED` | `false` | Set to `true` to show ads (also needs `ADSENSE_CLIENT_ID`) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | _(none)_ | Google AdSense publisher ID (e.g. `ca-pub-XXXXXXXX`) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | _(none)_ | Google Search Console `<meta>` verification token |

---

## Deploy to Vercel

The fastest path to production:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/audionest)

1. Click the button above or import the repo at [vercel.com/new](https://vercel.com/new)
2. Framework preset: **Next.js** (auto-detected)
3. Add any optional env vars you want (analytics, contact form)
4. Deploy — COOP/COEP headers come from `next.config.ts` automatically

> **Note on headers:** ffmpeg.wasm needs `SharedArrayBuffer`, which requires specific HTTP response headers. These are already configured in `next.config.ts` and applied to every route on Vercel automatically.

### Other hosts

If you're deploying to a non-Vercel host, you must forward these headers on all responses:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: cross-origin
```

Without them, ffmpeg.wasm silently fails to load.

---

## Project structure

```
audionest/
├── app/
│   ├── (tools)/[slug]/page.tsx   # Tool pages — route group, no /tools/ prefix in URL
│   ├── page.tsx                  # Home page (Hero, FeaturedGrid, TrustStrip, etc.)
│   ├── layout.tsx                # Root layout (glass system, nav, toploader, toasts)
│   ├── manifest.ts               # PWA manifest
│   ├── sitemap.ts                # Auto-generated sitemap.xml
│   ├── robots.ts                 # robots.txt
│   ├── not-found.tsx             # Branded 404
│   ├── error.tsx                 # Error boundary
│   ├── how-it-works/
│   ├── about/
│   ├── privacy-policy/
│   ├── terms/
│   └── contact/
│
├── components/
│   ├── glass/                    # Liquid Glass design system
│   │   ├── GlassFilter.tsx       # SVG <defs> — mounted once in layout
│   │   ├── GlassPanel.tsx        # Full 6-layer panel with tilt/parallax
│   │   ├── GlassCard.tsx         # Simplified card (no tilt)
│   │   ├── BlobBackground.tsx    # Canvas 2D animated blobs
│   │   └── GradientRing.tsx      # Animated gradient ring
│   ├── tool/                     # Shared tool UI
│   │   ├── ToolShell.tsx         # Page scaffold (breadcrumb, header, related tools)
│   │   ├── Dropzone.tsx          # File drop/select with validation
│   │   ├── ProgressRing.tsx      # Circular SVG progress + cancel
│   │   ├── ResultPanel.tsx       # Download link + audio preview
│   │   ├── AudioPlayer.tsx       # Waveform audio player
│   │   └── ErrorCard.tsx         # Error display with retry
│   ├── home/                     # Home page sections
│   ├── layout/                   # Header, Footer, BottomNav, AppSplash
│   └── brand/                    # Logo, Wordmark
│
├── lib/
│   ├── audio/
│   │   ├── ffmpeg.ts             # ffmpeg.wasm lazy singleton
│   │   ├── decode.ts             # AudioBuffer decoding + WAV export
│   │   ├── encode.ts             # Format encoding via ffmpeg
│   │   └── tools/                # One module per tool (runCut, runConvert, …)
│   ├── config/
│   │   ├── tools.ts              # Tool registry — 24 live + 4 soon
│   │   └── site.ts               # Site config from env vars
│   └── store/
│       ├── processing.ts         # Zustand: freezes animations while processing
│       └── favourites.ts         # Zustand + localStorage: saved tools
│
└── tests/
    └── audio-tools.test.ts       # Vitest unit tests for core logic
```

---

## Architecture notes

### How on-device processing works

1. User drops a file → it stays in browser memory, never transmitted
2. ffmpeg.wasm (a full WebAssembly port of FFmpeg) or the Web Audio API processes it
3. Output blob is offered as a download — then memory is freed

### Liquid Glass design system

Six rendering layers stacked in order:

1. **Refraction** — SVG `feTurbulence` + `feDisplacementMap` warps what's behind the glass
2. **Blur** — `backdrop-filter: blur(...)` softens the background
3. **Tint** — `bg-white/15` adds translucency
4. **Specular edge** — inset `box-shadow` mimics light hitting the rim
5. **Chromatic rim** — orange-to-gold gradient overlay simulates color fringing
6. **Shadow** — warm orange-cast drop shadow grounds the element

### Zustand stores

- `useProcessingState` — set during tool runs; BlobBackground pauses animations while `true`
- `useFavourites` — localStorage-persisted list of tool slugs; survives page reloads

### Adding a new tool

1. Add a `Tool` entry to `lib/config/tools.ts`
2. Create `lib/audio/tools/[name].ts` — export an async `run*` function
3. Create `app/(tools)/[slug]/page.tsx` — follow the pattern in any existing tool page
4. `bun run build` — must pass with zero errors

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, Turbopack |
| Language | TypeScript (strict) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with `@theme` tokens |
| Animation | [Framer Motion](https://framer.com/motion) |
| Audio processing | [ffmpeg.wasm](https://ffmpegwasm.netlify.app) (`@ffmpeg/ffmpeg` + `@ffmpeg/core`) |
| Audio analysis | Web Audio API (`AudioContext`, `OfflineAudioContext`) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| UI primitives | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Metadata reading | [music-metadata](https://github.com/borewit/music-metadata-browser) |
| ID3 writing | [browser-id3-writer](https://github.com/egoroof/browser-id3-writer) |
| BPM detection | [web-audio-beat-detector](https://github.com/chrisguttandin/web-audio-beat-detector) |
| Testing | [Vitest](https://vitest.dev) |
| Package manager | [Bun](https://bun.sh) |

---

## Privacy

AudioNest processes all audio **locally in your browser**. No audio data is ever sent to a server. The only external requests are:

- Loading the app itself (HTML, JS, CSS) from the host
- Optional analytics (Google Analytics) — only if `NEXT_PUBLIC_GA_ID` is set
- Optional contact form (Formspree) — only if `NEXT_PUBLIC_FORMSPREE_ID` is set and you submit the form

See the [Privacy Policy](/privacy-policy) for full details.

---

## Contributing

Pull requests are welcome. For major changes please open an issue first.

1. Fork and create a branch: `git checkout -b feat/my-tool`
2. Make your changes
3. `bun run build && bun run test` — must pass clean
4. Open a PR with a description of what and why

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">
Made with ♥ — everything runs on your device, never on ours.
</div>
