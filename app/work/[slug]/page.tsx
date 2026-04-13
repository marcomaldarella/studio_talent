import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanityClient'
import { PROJECT_BY_SLUG_QUERY, ALL_PROJECTS_QUERY } from '../../../lib/queries'
import type { Project } from '../../../types'
import Footer from '../../../components/Footer'
import '../../../styles/work.css'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p: Project | null = await client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null)
  return p ? { title: p.title } : { title: 'Project' }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const [project, all]: [Project | null, Project[]] = await Promise.all([
    client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(ALL_PROJECTS_QUERY).catch(() => []),
  ])

  if (!project) notFound()

  const idx = all.findIndex((p) => p.slug?.current === slug)
  const next = all[(idx + 1) % all.length] ?? null

  // Show coverImage + up to 2 extra images for the 3-panel layout
  const panel1 = project.coverImage
  const panel2 = project.images?.[0]
  const panel3 = project.images?.[1]

  return (
    <main className="st-project">
      {/* Info bar */}
      <div className="st-project-meta">
        <div className="st-project-meta-left">
          <span className="st-project-meta-title">{project.title}</span>
          <span className="st-project-meta-year">{project.year}</span>
        </div>
        <div className="st-project-meta-right">
          <span className="st-project-meta-category">
            {project.category ?? project.client ?? ''}
          </span>
          <Link href="/work" className="st-project-close">Close</Link>
        </div>
      </div>

      {/* 3-panel images */}
      <div className="st-project-images">
        {[panel1, panel2, panel3].map((src, i) => (
          <div key={i} className="st-project-img-wrap">
            {src ? (
              <Image
                src={src}
                alt={`${project.title} ${i + 1}`}
                fill
                className="st-project-img"
                sizes="33vw"
                priority={i === 0}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Description */}
      {project.description && (
        <div className="st-project-body">
          <div className="st-project-body-left" />
          <div className="st-project-body-right">
            <p className="st-project-desc">{project.description}</p>
          </div>
        </div>
      )}

      {/* Next project */}
      {next && next.slug?.current !== slug && (
        <Link href={`/work/${next.slug.current}`} className="st-next-project">
          <div className="st-next-left" />
          <div className="st-next-right">
            <div>
              <span className="st-next-label">Next project</span>
              <span className="st-next-title">{next.title}</span>
            </div>
            <span>→</span>
          </div>
        </Link>
      )}

      <Footer />
    </main>
  )
}
