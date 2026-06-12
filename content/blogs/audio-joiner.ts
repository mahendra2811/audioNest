import type { BlogPost } from './_types'

const posts: BlogPost[] = [
  {
    slug: 'how-to-merge-audio-files-online',
    title: 'How to Merge Multiple Audio Files into One — Online & Free',
    toolSlug: 'audio-joiner',
    excerpt: 'Combine podcast episodes, join music tracks, or stitch recordings together — no software needed.',
    publishedAt: '2024-11-18',
    readTime: 5,
    tags: ['merge audio', 'join audio', 'combine audio files', 'audio joiner'],
    content: `## When Do You Need to Join Audio Files?

- Combining lecture recordings split into multiple parts
- Merging podcast segments recorded separately
- Creating a continuous DJ mix from individual tracks

## How to Join Audio with [SITE_NAME]

1. Open [TOOL_LINK].
2. Drop multiple audio files (MP3, WAV, FLAC, OGG, AAC, M4A).
3. Drag to reorder them.
4. Set crossfade duration (0–5 seconds).
5. Process and download your combined MP3.

## Tips

- For podcasts: use 0 crossfade for clean cuts.
- For music mixes: use 2–3 seconds crossfade.
- All processing is 100% on-device — no uploads.`,
  },
  {
    slug: 'create-seamless-music-playlist-audio',
    title: 'Create a Seamless Continuous Music Playlist from Separate Tracks',
    toolSlug: 'audio-joiner',
    excerpt: 'Stop the awkward silence between songs. Join tracks into one gapless audio file.',
    publishedAt: '2024-12-01',
    readTime: 4,
    tags: ['gapless playback', 'DJ mix', 'merge music', 'continuous playlist'],
    content: `## The Problem with Separate Track Files

Gaps between tracks break the flow of a workout, party, or presentation playlist. Combining them into a single file solves this permanently.

## Workflow

1. Organize your track order first.
2. Normalize levels first with AudioNest Audio Normalizer if volumes differ.
3. Open [TOOL_LINK] and drop all tracks.
4. Set crossfade (2–3 seconds for music, 0 for podcasts).
5. Process and download.

## Use Cases

- **Workout playlists** — Nonstop music from warm-up through cooldown
- **Event background music** — One file, no playlist management
- **Podcast compilations** — Join highlights from multiple past episodes`,
  },
  {
    slug: 'join-audiobook-chapters',
    title: 'How to Join Multiple Audiobook Files Into One Continuous Track',
    toolSlug: 'audio-joiner',
    excerpt: 'Some audiobooks come as dozens of small files. Here is how to combine them into one.',
    publishedAt: '2024-12-15',
    readTime: 4,
    tags: ['audiobook chapters', 'join audio files', 'merge audiobook', 'combine MP3'],
    content: `## The Fragmented Audiobook Problem

Some audiobooks — especially those ripped from CDs or downloaded from older sources — arrive as 30–100 separate chapter files. Managing these is inconvenient for playback and syncing.

## Merging Audiobook Files

1. Sort files by track number or filename.
2. Open [TOOL_LINK].
3. Drop all chapter files in order.
4. Set crossfade to 0 (clean cuts between chapters).
5. Download the combined file.

## Important Notes

- The combined file may be large (1–3 GB for uncompressed WAV). Use Audio Compressor afterward if size matters.
- Some podcast apps and audiobook players prefer shorter files. Consider splitting at natural breaks (Part 1, Part 2) instead of full merge.`,
  },
  {
    slug: 'mix-voiceover-background-music',
    title: 'How to Layer a Voiceover Over Background Music',
    toolSlug: 'audio-joiner',
    excerpt: 'Combine a spoken voiceover with background music in one audio file.',
    publishedAt: '2025-01-05',
    readTime: 4,
    tags: ['voiceover mix', 'background music', 'layer audio', 'combine voice and music'],
    content: `## When You Need Voiceover + Music

- Creating audio for a presentation
- Recording a podcast with intro music
- Combining narration with ambient sound

## The Simple Approach

Use [TOOL_LINK] for sequential merging (one after the other): intro music → voiceover → outro music.

For true mixing (voice ON TOP of music simultaneously), you'll need a DAW like GarageBand or Audacity.

## Sequential Method with Audio Joiner

1. Prepare three files: intro.mp3, voiceover.mp3, outro.mp3.
2. Normalize each to the same level with Audio Normalizer.
3. Open [TOOL_LINK] and add them in order.
4. Use a 1-second crossfade between intro and voiceover for a smooth transition.
5. Download.`,
  },
  {
    slug: 'combine-podcast-intro-outro',
    title: 'Adding Intro and Outro Music to Your Podcast Automatically',
    toolSlug: 'audio-joiner',
    excerpt: 'A simple workflow for prepending intro music and appending outro music to any podcast episode.',
    publishedAt: '2025-01-15',
    readTime: 3,
    tags: ['podcast intro', 'podcast outro', 'podcast music', 'add intro to podcast'],
    content: `## The Standard Podcast Structure

Most podcast episodes follow: Intro music (15–30s) → Main content → Outro music (15–30s).

If you have a template intro and outro file, you can add them to any episode with Audio Joiner.

## Workflow

1. Prepare: intro.mp3, episode.mp3, outro.mp3.
2. Open [TOOL_LINK].
3. Add files in order: intro → episode → outro.
4. Set 0.5s crossfade between intro and episode for a smooth lead-in.
5. Set 0.5s crossfade between episode and outro.
6. Download your complete episode.

This workflow takes under 2 minutes per episode once your intro/outro files are ready.`,
  },
]

export default posts
