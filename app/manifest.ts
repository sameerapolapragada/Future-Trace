import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Career Shield',
    short_name: 'AIShield',
    description:
      'Analyze your job profile vulnerability against the modern AI disruption timeline',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#020617',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
