import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanityClient'
import { PRESS_BY_SLUG_QUERY, ALL_PRESS_QUERY } from '../../../lib/queries'
import type { PressItem } from '../../../types'
import PressDetail from './PressDetail'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item: PressItem | null = await client.fetch(PRESS_BY_SLUG_QUERY, { slug }).catch(() => null)
  if (!item) return { title: 'Press' }
  return {
    title: item.publication,
    description: item.description ?? `${item.publication} — Press coverage of an Onira production, ${item.year}.`,
    openGraph: {
      title: `${item.publication} — Onira Press`,
      description: item.description ?? `${item.publication} — Press coverage of an Onira production, ${item.year}.`,
      ...(item.coverImage ? { images: [{ url: item.coverImage, width: 1200, height: 630, alt: item.publication }] } : {}),
    },
  }
}

export default async function PressDetailPage({ params }: Props) {
  const { slug } = await params
  const [item, all]: [PressItem | null, PressItem[]] = await Promise.all([
    client.fetch(PRESS_BY_SLUG_QUERY, { slug }).catch(() => null),
    client.fetch(ALL_PRESS_QUERY).catch(() => []),
  ])

  if (!item) notFound()

  const idx = all.findIndex((p) => p.slug?.current === slug)
  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx < all.length - 1 ? all[idx + 1] : null

  return <PressDetail item={item} prev={prev} next={next} />
}
