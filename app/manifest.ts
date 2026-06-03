import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Future Trace',
    short_name: 'FutureTrace',
    description: 'Career Intelligence for the AI Age',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#000000',
    theme_color: '#FDBB2D',
    icons: [
      {
        src: '/future-trace-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/future-trace-logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
