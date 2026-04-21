import type { MetadataRoute } from 'next'
import { client } from '../lib/sanityClient'

const BASE_URL = 'https://onira.one'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/work`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/press`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const projects = await client
    .fetch<{ slug: { current: string } }[]>(
      `*[_type == "project" && defined(slug.current)] { slug }`
    )
    .catch(() => [] as { slug: { current: string } }[])

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/work/${p.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const pressItems = await client
    .fetch<{ slug: { current: string } }[]>(
      `*[_type == "press" && defined(slug.current)] { slug }`
    )
    .catch(() => [] as { slug: { current: string } }[])

  const pressPages: MetadataRoute.Sitemap = pressItems.map((p) => ({
    url: `${BASE_URL}/press/${p.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...projectPages, ...pressPages]
}
