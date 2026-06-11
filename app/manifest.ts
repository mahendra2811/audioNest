import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AudioNest',
    short_name: 'AudioNest',
    description: 'Every audio tool. Right in your browser.',
    theme_color: '#6366f1',
    background_color: '#faf9ff',
    display: 'standalone',
    orientation: 'portrait-primary',
    start_url: '/',
    scope: '/',
    icons: [
      { src: '/icon', sizes: 'any', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: 'any', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['utilities', 'music'],
    shortcuts: [
      { name: 'Audio Converter', short_name: 'Converter', url: '/audio-converter' },
      { name: 'Audio Cutter', short_name: 'Cutter', url: '/audio-cutter' },
      { name: 'Audio Joiner', short_name: 'Joiner', url: '/audio-joiner' },
      { name: 'Volume Booster', short_name: 'Booster', url: '/volume-booster' },
    ],
  }
}
