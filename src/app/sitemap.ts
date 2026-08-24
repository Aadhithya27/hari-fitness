import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hari-fitness.vercel.app';
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      images: [
        `${baseUrl}/images/transformations/trainer-after.jpg`,
        `${baseUrl}/images/transformations/client-2-after.jpg`,
        `${baseUrl}/images/transformations/client-3-after.jpg`,
      ],
    },
    {
      url: `${baseUrl}/auth`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard/client`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard/trainer`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ];
}
