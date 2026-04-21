import type { Metadata } from 'next'
import { client } from '../../lib/sanityClient'
import { ALL_PRESS_QUERY } from '../../lib/queries'
import type { PressItem } from '../../types'
import PressList from './PressList'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Press',
  description: 'Press coverage and media mentions of Onira films and productions.',
}

export default async function PressPage() {
  const items: PressItem[] = await client.fetch(ALL_PRESS_QUERY).catch(() => [])

  return (
    <main className="st-press">
      <PressList items={items} />
      
    </main>
  )
}
