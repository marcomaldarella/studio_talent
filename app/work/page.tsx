import type { Metadata } from 'next'
import { client } from '../../lib/sanityClient'
import { ALL_PROJECTS_QUERY } from '../../lib/queries'
import type { Project } from '../../types'
import WorkList from './WorkList'
import '../../styles/work.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Films',
  description: 'Browse all films produced by Onira — independent documentaries and short films that challenge the human experience.',
}

const PLACEHOLDERS = [
  { _id: 'p1', title: 'LILITH', year: 2026, category: 'Interior' },
  { _id: 'p2', title: 'LILITH', year: 2026, category: 'Interior' },
  { _id: 'p3', title: 'LILITH', year: 2026, category: 'Interior' },
  { _id: 'p4', title: 'LILITH', year: 2026, category: 'Interior' },
]

export default async function WorkPage() {
  const projects: Project[] = await client.fetch(ALL_PROJECTS_QUERY).catch(() => [])
  const items = projects.length > 0 ? projects : PLACEHOLDERS as unknown as Project[]

  return (
    <main className="st-work">
      <div className="st-work-list">
        <div className="st-work-list-left" />
        <WorkList items={items} />
      </div>
    </main>
  )
}
