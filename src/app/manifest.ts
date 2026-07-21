import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HARI FITNESS | Personal Training & Coaching SaaS',
    short_name: 'HariFitness',
    description: 'Transform your body and master your discipline with Coach Hari. Customized workout routines, nutrition logging, and real-time client analytics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#FF1E1E',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
