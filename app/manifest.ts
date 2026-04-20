import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Studio Talent',
    short_name: 'Studio Talent',
    description: 'Studio di architettura ed interior.',
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
