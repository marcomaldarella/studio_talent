import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '../../lib/sanityClient'
import { ALL_PROJECTS_QUERY } from '../../lib/queries'
import type { Project } from '../../types'
import '../../styles/work.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Work' }

const PLACEHOLDERS = [
  { _id: 'p1', title: 'LILITH', year: 2026, category: 'Interior', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in mi risus.' },
  { _id: 'p2', title: 'LILITH', year: 2026, category: 'Interior', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in mi risus.' },
  { _id: 'p3', title: 'LILITH', year: 2026, category: 'Interior', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in mi risus.' },
  { _id: 'p4', title: 'LILITH', year: 2026, category: 'Interior', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in mi risus.' },
]

export default async function WorkPage() {
  const projects: Project[] = await client.fetch(ALL_PROJECTS_QUERY).catch(() => [])
  const items = projects.length > 0 ? projects : PLACEHOLDERS as unknown as Project[]

  return (
    <main className="st-work">
      <div className="st-work-list">
        <div className="st-work-list-left" />
        <div className="st-work-list-right">
          {items.map((p) => (
            <Link
              key={p._id}
              href={p.slug ? `/work/${p.slug.current}` : '#'}
              className="st-work-item"
            >
              <div className="st-work-item-header">
                <span className="st-work-item-title">{p.title}</span>
              </div>
              <div className="st-work-item-body">
                <div className="st-work-item-left">
                  <span className="st-work-item-year">{p.year}</span>
                  {p.coverImage ? (
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      width={80}
                      height={108}
                      className="st-work-item-thumb"
                    />
                  ) : (
                    <div className="st-work-item-thumb" />
                  )}
                </div>
                {p.description && (
                  <p className="st-work-item-desc">{p.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </main>
  )
}
