import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Onira',
    short_name: 'Onira',
    description: 'Independent film production studio.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ECEBE7',
    theme_color: '#1D1D1B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
