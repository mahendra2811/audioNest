export type ToolCategory =
  | 'cut'
  | 'convert'
  | 'volume'
  | 'clean'
  | 'effects'
  | 'channels'
  | 'analyze'
  | 'metadata'
  | 'create'

export type ToolEngine = 'webaudio' | 'ffmpeg' | 'mixed'
export type ToolOutput = 'mp3' | 'zip' | 'mp4' | 'display' | 'same'
export type ToolStatus = 'live' | 'soon'

export interface Tool {
  slug: string
  name: string
  benefit: string
  icon: string
  category: ToolCategory
  featured: boolean
  status: ToolStatus
  engine: ToolEngine
  accepts: string[]
  output: ToolOutput
  seo: { title: string; description: string }
}

export const AUDIO_ACCEPTS = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/m4a',
  'audio/x-m4a',
  'audio/opus',
  '.mp3',
  '.wav',
  '.ogg',
  '.flac',
  '.aac',
  '.m4a',
  '.opus',
  '.wma',
]

export const VIDEO_ACCEPTS = [
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
  'video/webm',
  '.mp4',
  '.mov',
  '.mkv',
  '.avi',
  '.webm',
]

export const IMAGE_ACCEPTS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
]

export const tools: Tool[] = [
  // ── Cut & Edit ──────────────────────────────────────────────────────────────
  {
    slug: 'audio-cutter',
    name: 'Audio Cutter',
    benefit: 'Trim any audio file to the exact moment you need',
    icon: 'Scissors',
    category: 'cut',
    featured: true,
    status: 'live',
    engine: 'mixed',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Audio Cutter — Free Online Audio Trimmer',
      description:
        'Cut and trim audio files online for free. No upload, works 100% in your browser.',
    },
  },
  {
    slug: 'audio-joiner',
    name: 'Audio Joiner',
    benefit: 'Merge multiple audio tracks into one seamless file',
    icon: 'Link2',
    category: 'cut',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Audio Joiner — Merge Audio Files Online Free',
      description:
        'Join and merge multiple audio files online. Add crossfade, reorder tracks, download as MP3.',
    },
  },
  {
    slug: 'audio-splitter',
    name: 'Audio Splitter',
    benefit: 'Split one audio file into multiple segments',
    icon: 'SplitSquareHorizontal',
    category: 'cut',
    featured: true,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'zip',
    seo: {
      title: 'Audio Splitter — Split Audio Files Online Free',
      description:
        'Split audio files into equal parts or by time intervals. Download as ZIP. Free, no upload.',
    },
  },
  {
    slug: 'silence-remover',
    name: 'Silence Remover',
    benefit: 'Automatically cut silent gaps from recordings',
    icon: 'VolumeX',
    category: 'cut',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Silence Remover — Remove Silence from Audio Free',
      description:
        'Remove silent sections from audio automatically. Set threshold and minimum duration. Free.',
    },
  },
  {
    slug: 'audio-reverser',
    name: 'Audio Reverser',
    benefit: 'Reverse audio to play it backwards',
    icon: 'Rewind',
    category: 'cut',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Audio Reverser — Reverse Audio Online Free',
      description: 'Reverse any audio file to play backwards. Free, instant, no upload needed.',
    },
  },

  // ── Convert ──────────────────────────────────────────────────────────────────
  {
    slug: 'audio-converter',
    name: 'Audio Converter',
    benefit: 'Convert audio between MP3, WAV, FLAC, AAC, OGG and more',
    icon: 'RefreshCw',
    category: 'convert',
    featured: true,
    status: 'live',
    engine: 'ffmpeg',
    accepts: [...AUDIO_ACCEPTS, ...VIDEO_ACCEPTS],
    output: 'same',
    seo: {
      title: 'Audio Converter — Convert Audio Files Online Free',
      description:
        'Convert audio to MP3, WAV, FLAC, AAC, OGG, M4A, Opus. Free, private, no upload.',
    },
  },
  {
    slug: 'video-to-audio',
    name: 'Video to Audio',
    benefit: 'Extract the audio track from any video file',
    icon: 'Film',
    category: 'convert',
    featured: true,
    status: 'live',
    engine: 'ffmpeg',
    accepts: VIDEO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Video to Audio — Extract Audio from Video Free',
      description:
        'Extract audio from MP4, MOV, MKV, AVI, WebM videos. Download as MP3, WAV or AAC.',
    },
  },
  {
    slug: 'photo-audio-to-video',
    name: 'Photo + Audio → Video',
    benefit: 'Combine an image and audio to create a video',
    icon: 'ImagePlay',
    category: 'convert',
    featured: true,
    status: 'live',
    engine: 'ffmpeg',
    accepts: [...IMAGE_ACCEPTS, ...AUDIO_ACCEPTS],
    output: 'mp4',
    seo: {
      title: 'Photo to Video — Create Video from Image + Audio Free',
      description:
        'Create a video from a photo and audio file. Perfect for lyric videos and podcasts.',
    },
  },

  // ── Clean & Compress ─────────────────────────────────────────────────────────
  {
    slug: 'noise-remover',
    name: 'Noise Remover',
    benefit: 'AI-powered noise suppression for cleaner voice recordings',
    icon: 'Mic',
    category: 'clean',
    featured: true,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Noise Remover — Remove Background Noise from Audio Free',
      description:
        'Remove background noise from audio using AI. Best for voice recordings. Free, on-device.',
    },
  },
  {
    slug: 'audio-compressor',
    name: 'Audio Compressor',
    benefit: 'Reduce file size without unnecessary quality loss',
    icon: 'PackageOpen',
    category: 'clean',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Audio Compressor — Compress Audio Files Free',
      description: 'Compress audio files to reduce size. Choose target bitrate. Free, no upload.',
    },
  },

  // ── Volume & Loudness ────────────────────────────────────────────────────────
  {
    slug: 'volume-booster',
    name: 'Volume Booster',
    benefit: 'Increase or decrease volume by up to ±20 dB',
    icon: 'Volume2',
    category: 'volume',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Volume Booster — Boost Audio Volume Online Free',
      description: 'Boost or reduce audio volume by up to 20 dB. Live preview. Free, on-device.',
    },
  },
  {
    slug: 'audio-normalizer',
    name: 'Audio Normalizer',
    benefit: 'Set consistent loudness for streaming, podcast, or broadcast',
    icon: 'SlidersHorizontal',
    category: 'volume',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Audio Normalizer — Normalize Audio Loudness Online Free',
      description:
        'Normalize audio to −14 LUFS (streaming), −16 LUFS (podcast), or −23 LUFS (broadcast).',
    },
  },
  {
    slug: 'bass-booster',
    name: 'Bass Booster',
    benefit: 'Boost low frequencies for richer, deeper sound',
    icon: 'AudioWaveform',
    category: 'volume',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Bass Booster — Boost Bass in Audio Online Free',
      description:
        'Boost bass frequencies up to +12 dB with a lowshelf filter. Free, on-device processing.',
    },
  },
  {
    slug: 'loudness-meter',
    name: 'Loudness Meter',
    benefit: 'Measure LUFS, RMS, peak, and true peak levels',
    icon: 'BarChart2',
    category: 'analyze',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'display',
    seo: {
      title: 'Loudness Meter — Measure Audio LUFS Online Free',
      description:
        'Analyze audio loudness: Integrated LUFS, LRA, True Peak, RMS, Peak dBFS. EBU R128.',
    },
  },

  // ── Effects ───────────────────────────────────────────────────────────────────
  {
    slug: 'reverb-adder',
    name: 'Reverb Adder',
    benefit: 'Add room, hall, church, or studio reverb to any audio',
    icon: 'Waves',
    category: 'effects',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Reverb Adder — Add Reverb to Audio Online Free',
      description:
        'Add reverb to audio: Room, Hall, Church, Cave, Studio, Plate presets. Free, on-device.',
    },
  },
  {
    slug: 'speed-changer',
    name: 'Speed Changer',
    benefit: 'Change playback speed without altering pitch',
    icon: 'Gauge',
    category: 'effects',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Speed Changer — Change Audio Speed Without Pitch Shift',
      description:
        'Change audio speed from 0.25× to 4× while keeping the original pitch. Free, on-device.',
    },
  },
  {
    slug: 'pitch-shifter',
    name: 'Pitch Shifter',
    benefit: 'Shift pitch up or down in semitones without changing tempo',
    icon: 'Music',
    category: 'effects',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Pitch Shifter — Change Pitch Online Free',
      description:
        'Shift audio pitch ±12 semitones without changing speed. Free, on-device, no upload.',
    },
  },

  // ── Channels ─────────────────────────────────────────────────────────────────
  {
    slug: 'stereo-to-mono',
    name: 'Stereo to Mono',
    benefit: 'Convert stereo audio to mono to halve the file size',
    icon: 'Radio',
    category: 'channels',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Stereo to Mono — Convert Audio Channels Online Free',
      description:
        'Convert stereo audio to mono. Reduces file size by ~50%. Free, instant, no upload.',
    },
  },
  {
    slug: 'mono-to-stereo',
    name: 'Mono to Stereo',
    benefit: 'Duplicate a mono channel to create stereo audio',
    icon: 'Headphones',
    category: 'channels',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Mono to Stereo — Convert Mono Audio to Stereo Free',
      description: 'Convert mono audio to stereo by duplicating the channel. Free, on-device.',
    },
  },

  // ── Analyze ───────────────────────────────────────────────────────────────────
  {
    slug: 'bpm-detector',
    name: 'BPM Detector',
    benefit: 'Detect the tempo of any song in seconds',
    icon: 'Timer',
    category: 'analyze',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'display',
    seo: {
      title: 'BPM Detector — Find Tempo of Any Song Online Free',
      description: 'Detect the BPM (beats per minute) of any audio file. Free, instant, on-device.',
    },
  },

  // ── Metadata ──────────────────────────────────────────────────────────────────
  {
    slug: 'id3-tag-editor',
    name: 'ID3 Tag Editor',
    benefit: 'Edit MP3 tags: title, artist, album, cover art and more',
    icon: 'Tag',
    category: 'metadata',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: ['audio/mp3', 'audio/mpeg', '.mp3'],
    output: 'mp3',
    seo: {
      title: 'ID3 Tag Editor — Edit MP3 Tags Online Free',
      description:
        'Edit MP3 ID3 tags: title, artist, album, year, genre, cover art. Free, on-device.',
    },
  },
  {
    slug: 'metadata-remover',
    name: 'Metadata Remover',
    benefit: 'Strip all metadata including hidden GPS and device info',
    icon: 'ShieldOff',
    category: 'metadata',
    featured: false,
    status: 'live',
    engine: 'ffmpeg',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Metadata Remover — Strip Audio Metadata Online Free',
      description:
        'Remove all metadata from audio files including GPS location and device info. Privacy first.',
    },
  },

  // ── Create ────────────────────────────────────────────────────────────────────
  {
    slug: 'loop-maker',
    name: 'Loop Maker',
    benefit: 'Repeat a short clip any number of times into one file',
    icon: 'Repeat',
    category: 'create',
    featured: false,
    status: 'live',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Loop Maker — Create Audio Loops Online Free',
      description:
        'Loop audio 2–50× with optional gaps between. Preview and export. Free, on-device.',
    },
  },
  {
    slug: 'audio-info',
    name: 'Audio Info',
    benefit: 'Inspect format, codec, bitrate, tags, and cover art',
    icon: 'Info',
    category: 'analyze',
    featured: true,
    status: 'live',
    engine: 'ffmpeg',
    accepts: [...AUDIO_ACCEPTS, ...VIDEO_ACCEPTS],
    output: 'display',
    seo: {
      title: 'Audio Info — Inspect Audio File Details Free',
      description:
        'View format, codec, bitrate, sample rate, duration, ID3 tags, and cover art of any audio.',
    },
  },

  // ── Coming Soon (v1.1 roadmap) ────────────────────────────────────────────────
  {
    slug: 'vocal-remover',
    name: 'Vocal Remover',
    benefit: 'Separate vocals from music using on-device AI',
    icon: 'MicOff',
    category: 'effects',
    featured: false,
    status: 'soon',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Vocal Remover — Remove Vocals from Music Free (Coming Soon)',
      description: 'Remove vocals from any song using on-device AI. Coming soon to AudioNest.',
    },
  },
  {
    slug: 'stem-splitter',
    name: 'Stem Splitter',
    benefit: 'Split audio into vocals, drums, bass, and instruments',
    icon: 'LayoutGrid',
    category: 'effects',
    featured: false,
    status: 'soon',
    engine: 'webaudio',
    accepts: AUDIO_ACCEPTS,
    output: 'zip',
    seo: {
      title: 'Stem Splitter — Split Audio into Stems Free (Coming Soon)',
      description:
        'Separate audio into stems: vocals, drums, bass, and other instruments. Coming soon.',
    },
  },
  {
    slug: 'beat-sequencer',
    name: 'Beat Sequencer',
    benefit: 'Build beats on a grid and export as audio',
    icon: 'Grid3x3',
    category: 'create',
    featured: false,
    status: 'soon',
    engine: 'webaudio',
    accepts: [],
    output: 'mp3',
    seo: {
      title: 'Beat Sequencer — Make Beats Online Free (Coming Soon)',
      description:
        'Create beats with a step sequencer grid. Set BPM, place sounds, export. Coming soon.',
    },
  },
  {
    slug: 'clip-timeline',
    name: 'Clip Timeline',
    benefit: 'Arrange audio clips on a timeline and export',
    icon: 'AlignStartHorizontal',
    category: 'create',
    featured: false,
    status: 'soon',
    engine: 'mixed',
    accepts: AUDIO_ACCEPTS,
    output: 'mp3',
    seo: {
      title: 'Clip Timeline — Audio Timeline Editor (Coming Soon)',
      description: 'Arrange audio clips on a timeline, set order and timing, export. Coming soon.',
    },
  },
]

export const liveTools = tools.filter((t) => t.status === 'live')
export const featuredTools = tools.filter((t) => t.featured && t.status === 'live')
export const soonTools = tools.filter((t) => t.status === 'soon')

export const CATEGORIES: Array<{ id: ToolCategory; label: string }> = [
  { id: 'cut', label: 'Cut & Edit' },
  { id: 'convert', label: 'Convert' },
  { id: 'clean', label: 'Clean & Compress' },
  { id: 'volume', label: 'Volume & Loudness' },
  { id: 'effects', label: 'Effects' },
  { id: 'channels', label: 'Channels' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'create', label: 'Create' },
]

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return liveTools.filter((t) => t.category === category)
}

export function getRelatedTools(tool: Tool, count = 4): Tool[] {
  return liveTools
    .filter((t) => t.slug !== tool.slug && t.category === tool.category)
    .slice(0, count)
}
