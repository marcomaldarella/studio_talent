import Link from 'next/link'
import Image from 'next/image'
import { client } from '../lib/sanityClient'
import { FEATURED_PROJECTS_QUERY } from '../lib/queries'
import type { Project } from '../types'
import Footer from '../components/Footer'
import '../styles/home.css'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const projects: Project[] = await client
    .fetch(FEATURED_PROJECTS_QUERY)
    .catch(() => [])

  return (
    <main className="st-home">
      {/* Hero */}
      <section className="st-hero">
        <p className="st-hero-eyebrow">Creative Agency — Est. 2020</p>
        <h1 className="st-hero-title">
          We make<br />work that<br />matters.
        </h1>
        <p className="st-hero-desc">
          Studio Talent is a creative agency working across film,
          photography, fashion, and art direction.
        </p>
      </section>

      {/* Selected Work */}
      <section className="st-selected">
        <div className="st-selected-header">
          <span className="st-selected-title">Selected Work</span>
          <Link href="/work" className="st-selected-link">
            All work →
          </Link>
        </div>
        <div className="st-project-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                key={project._id}
                href={`/work/${project.slug.current}`}
                className="st-project-card"
              >
                <div className="st-card-img-wrap">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="st-card-img"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="st-card-placeholder">No image</div>
                  )}
                </div>
                <div className="st-card-info">
                  <span className="st-card-title">{project.title}</span>
                  <div className="st-card-meta">
                    <span>{project.year}</span>
                    {project.category && <span>{project.category}</span>}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            /* Placeholder cards when no content yet */
            [1, 2, 3].map((i) => (
              <div key={i} className="st-project-card">
                <div className="st-card-img-wrap">
                  <div className="st-card-placeholder">Image</div>
                </div>
                <div className="st-card-info">
                  <span className="st-card-title">Project {i}</span>
                  <div className="st-card-meta">
                    <span>2026</span>
                    <span>Film</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
