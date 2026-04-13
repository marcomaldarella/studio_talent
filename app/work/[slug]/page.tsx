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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project: Project | null = await client
    .fetch(PROJECT_BY_SLUG_QUERY, { slug })
    .catch(() => null)

  if (!project) return { title: 'Project Not Found' }

  return {
    title: project.title,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params

  const [project, allProjects]: [Project | null, Project[]] = await Promise.all([
    client.fetch(PROJECT_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(ALL_PROJECTS_QUERY).catch(() => []),
  ])

  if (!project) notFound()

  // Find next project
  const currentIndex = allProjects.findIndex((p) => p.slug.current === slug)
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length] ?? null

  return (
    <main className="st-project-detail">
      {/* Row 1: title + close */}
      <div className="st-project-bar">
        <span className="st-project-bar-title">{project.title}</span>
        <Link href="/work" className="st-project-bar-close">
          Close
        </Link>
      </div>

      {/* Row 2: year + category */}
      <div className="st-project-bar">
        <span className="st-project-bar-year">{project.year}</span>
        <span className="st-project-bar-category">
          {project.category ?? project.client ?? '—'}
        </span>
      </div>

      {/* Cover image */}
      <div className="st-project-cover">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="st-project-cover-img"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="st-project-cover-placeholder">No image</div>
        )}
      </div>

      {/* Description + tags */}
      {(project.description || (project.tags && project.tags.length > 0)) && (
        <div className="st-project-body">
          {project.description && (
            <p className="st-project-desc">{project.description}</p>
          )}
          {project.tags && project.tags.length > 0 && (
            <div className="st-project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="st-project-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="st-project-gallery">
          {project.images.map((img, i) => (
            <div key={i} className="st-gallery-item">
              <Image
                src={img}
                alt={`${project.title} — ${i + 1}`}
                fill
                className="st-gallery-img"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Next project */}
      {nextProject && nextProject.slug.current !== slug && (
        <Link
          href={`/work/${nextProject.slug.current}`}
          className="st-next-project"
        >
          <div>
            <span className="st-next-label">Next project</span>
            <span className="st-next-title">{nextProject.title}</span>
          </div>
          <span>→</span>
        </Link>
      )}

      <Footer />
    </main>
  )
}
