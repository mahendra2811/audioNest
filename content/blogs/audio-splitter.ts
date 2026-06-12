import type { BlogPost } from './_types'

const posts: BlogPost[] = [
  {
    slug: 'how-to-split-audio-into-parts',
    title: 'How to Split a Large Audio File into Multiple Parts Online',
    toolSlug: 'audio-splitter',
    excerpt: 'Split long recordings, podcasts, or audiobooks into smaller chunks. No software needed.',
    publishedAt: '2024-11-20',
    readTime: 5,
    tags: ['split audio', 'audio splitter', 'split MP3', 'divide audio'],
    content: `## Why Split Audio Files?

- **Email limits** — Most email clients cap attachments at 25 MB. Split a lecture into 10-minute chunks.
- **Podcast chapters** — Separate a 2-hour recording into individual episode segments.
- **Upload limits** — Many platforms cap individual uploads at 100 MB.

## Two Split Modes

**By time intervals** — Split every N minutes. A 60-minute file at 10-minute intervals becomes 6 parts.
**By file count** — Split into exactly N equal pieces.

## Step-by-Step

1. Open [TOOL_LINK].
2. Drop your audio file (MP3, WAV, FLAC, OGG, AAC, M4A).
3. Choose split method: equal intervals or equal parts.
4. Set the interval or number of parts.
5. Download a ZIP file with all segments.

## Tips

- Name output files before sharing — segments are numbered automatically.
- For podcasts, split at natural pauses rather than arbitrary timestamps. Use Audio Cutter for that.`,
  },
  {
    slug: 'split-podcast-episode-chapters',
    title: 'How to Split a Podcast Recording into Episode Chapters',
    toolSlug: 'audio-splitter',
    excerpt: 'Turn a single long recording into clean, individual podcast chapters.',
    publishedAt: '2024-12-05',
    readTime: 4,
    tags: ['podcast chapters', 'split podcast', 'episode splitter', 'audio editing'],
    content: `## Record Long, Split Short

Many podcasters record entire sessions in one take, then split into chapters during post-production. This is cleaner than stopping and restarting recording mid-session.

## The Workflow

1. Record your full session uninterrupted.
2. Note chapter timestamps (e.g., 0:00 Intro, 12:00 Topic 1, 28:45 Topic 2).
3. For **precise timestamp splits**: Use Audio Cutter ([TOOL_LINK]'s tool) to extract each segment manually.
4. For **equal-length chapters**: Use [TOOL_LINK] with a time interval that matches your typical chapter length.

## After Splitting

Use AudioNest ID3 Tag Editor to add chapter-specific titles, track numbers, and episode art to each file.`,
  },
  {
    slug: 'split-audiobook-into-chapters',
    title: 'How to Split a Single Audiobook File into Chapters',
    toolSlug: 'audio-splitter',
    excerpt: 'Received one huge audiobook MP3? Here is how to split it into navigable chapters.',
    publishedAt: '2025-01-08',
    readTime: 4,
    tags: ['split audiobook', 'audiobook chapters', 'divide MP3', 'chapter split'],
    content: `## The Single-File Audiobook Problem

Some audiobooks arrive as one enormous file — no chapters, no navigation. Long car rides or sleep listening become uncomfortable when you can't resume from a specific point.

## Split by Equal Time

If you don't know exact chapter timestamps, split by time:
1. Open [TOOL_LINK].
2. Drop the audiobook file.
3. Split every 20–30 minutes (typical chapter length).
4. Each segment downloads as a numbered MP3.

## Split by Known Timestamps

If you have the chapter timestamps (from the book's table of contents or an app):
1. Use AudioNest Audio Cutter for each chapter.
2. Set exact start and end times per chapter.
3. Name each file by chapter title.

## After Splitting

Tag each file with track numbers using AudioNest ID3 Tag Editor so your player sorts chapters correctly.`,
  },
  {
    slug: 'split-music-album-tracks',
    title: 'How to Split a Full Album Recording into Individual Tracks',
    toolSlug: 'audio-splitter',
    excerpt: 'Split a continuous album recording into individual track files.',
    publishedAt: '2025-01-20',
    readTime: 4,
    tags: ['split album', 'extract tracks', 'album to tracks', 'split audio tracks'],
    content: `## Vinyl Rips and Live Albums

When digitizing vinyl records or recording live concerts, you often get one long file instead of individual tracks. Splitting it gives you a proper track-by-track music library.

## Finding Track Timestamps

1. Listen through the recording (at 1.5x speed with AudioNest Speed Changer to save time).
2. Note timestamps where each track begins and ends.
3. Add 1–2 seconds of lead-in and lead-out for each track.

## Splitting Approach

For **equal-length tracks** (rare but possible in some genres): Use [TOOL_LINK] with a time interval.

For **variable-length tracks**: Use AudioNest Audio Cutter for each track individually with precise timestamps.

## Final Steps

After splitting, tag each track with AudioNest ID3 Tag Editor: track number, title, artist, album name, year.`,
  },
  {
    slug: 'split-large-file-for-email',
    title: 'How to Split an Audio File to Send via Email',
    toolSlug: 'audio-splitter',
    excerpt: 'Email attachments have size limits. Here is how to split audio to fit within them.',
    publishedAt: '2025-02-01',
    readTime: 3,
    tags: ['email audio', 'split for email', 'audio file size limit', 'send large audio'],
    content: `## Email Attachment Limits

| Email Provider | Max Attachment |
|----------------|---------------|
| Gmail | 25 MB |
| Outlook | 20 MB |
| Yahoo Mail | 25 MB |

## Calculate How Many Parts You Need

At 128 kbps MP3: 1 minute ≈ 1 MB. A 30-minute recording ≈ 30 MB — too large for Gmail.

To send a 30-minute, 30 MB recording: split into 2 × 15-minute parts (≈15 MB each — within Gmail's limit).

## Steps

1. Open [TOOL_LINK].
2. Drop your audio.
3. Split into equal parts — estimate how many based on the size calculation above.
4. Download the ZIP and email each part individually.

Include a note in the email: "File 1 of 2 — play in order."`,
  },
]

export default posts
