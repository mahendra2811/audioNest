import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AudioNest',
    short_name: 'AudioNest',
    description: 'Every audio tool. Right in your browser.',
    theme_color: '#6366f1',
    background_color: 'var(--bg)',
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['utilities', 'music'],
    shortcuts: [
      {
        name: 'Audio Converter',
        short_name: 'Converter',
        url: '/tools/audio-converter',
      },
      {
        name: 'Audio Trimmer',
        short_name: 'Trimmer',
        url: '/tools/audio-trimmer',
      },
      {
        name: 'Audio Merger',
        short_name: 'Merger',
        url: '/tools/audio-merger',
      },
      {
        name: 'Volume Booster',
        short_name: 'Booster',
        url: '/tools/volume-booster',
      },
    ],
  }
}
