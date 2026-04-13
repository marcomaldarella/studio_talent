import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '../../lib/sanityClient'
import { ALL_PROJECTS_QUERY } from '../../lib/queries'
import type { Project } from '../../types'
import Footer from '../../components/Footer'
import '../../styles/work.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Work',
}

export default async function WorkPage() {
  const projects: Project[] = await client
    .fetch(ALL_PROJECTS_QUERY)
    .catch(() => [])

  return (
    <main className="st-work">
      <div className="st-work-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className="st-work-row"
            >
              <div className="st-work-row-left">
                <span className="st-work-row-title">{project.title}</span>
                <div className="st-work-row-meta">
                  <span>{project.year}</span>
                  {project.category && <span>{project.category}</span>}
                  {project.client && <span>{project.client}</span>}
                </div>
              </div>
              <div className="st-work-row-right">
                {project.coverImage && (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    width={60}
                    height={80}
                    className="st-work-row-thumb"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>
            </Link>
          ))
        ) : (
          /* Placeholder rows */
          ['LILITH', 'ARIEL', 'NOVA', 'ECHO', 'FLUX'].map((name) => (
            <div key={name} className="st-work-row">
              <div className="st-work-row-left">
                <span className="st-work-row-title">{name}</span>
                <div className="st-work-row-meta">
                  <span>2026</span>
                  <span>Film</span>
                </div>
              </div>
              <div className="st-work-row-right" />
            </div>
          ))
        )}
      </div>
      <Footer />
    </main>
  )
}
