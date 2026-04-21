import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanityClient'
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECTS_QUERY } from '../../../lib/queries'
import type { Project } from '../../../types'
import ProjectDetail from './ProjectDetail'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p: Project | null = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!p) return { title: 'Film' }
  return {
    title: p.title,
    description: p.description ?? `${p.title} — ${p.category}, ${p.year}. An Onira production.`,
    openGraph: {
      title: `${p.title} — Onira`,
      description: p.description ?? `${p.title} — ${p.category}, ${p.year}. An Onira production.`,
      ...(p.coverImage ? { images: [{ url: p.coverImage, width: 1200, height: 630, alt: p.title }] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, all]: [Project | null, Project[]] = await Promise.all([
    client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(ALL_PROJECTS_QUERY).catch(() => []),
  ])

  if (!project) notFound()

  const idx = all.findIndex((p) => p.slug?.current === slug)
  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx < all.length - 1 ? all[idx + 1] : null

  return <ProjectDetail project={project} prev={prev} next={next} />
}
