'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import TransitionLink from '../../components/TransitionLink'
import type { Project } from '../../types'

interface Props {
  items: Project[]
}

export default function WorkList({ items }: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const workItems = Array.from(el.querySelectorAll<HTMLElement>('.st-work-item'))
    gsap.fromTo(
      workItems,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
    )
  }, [])

  return (
    <div ref={listRef} className="st-work-list-right">
      {items.map((p) => (
        <TransitionLink
          key={p._id}
          href={p.slug ? `/work/${p.slug.current}` : '#'}
          className="st-work-item"
        >
          <div className="st-work-item-header">
            <span className="st-work-item-title">{p.title}</span>
          </div>
          <div className="st-work-item-meta">
            <span className="st-work-item-year">{p.year}</span>
            {p.category && <span className="st-work-item-category">{p.category}</span>}
          </div>
          <div className="st-work-item-thumb-wrap">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                width={400}
                height={540}
                className="st-work-item-thumb"
              />
            ) : (
              <div className="st-work-item-thumb" />
            )}
          </div>
        </TransitionLink>
      ))}
    </div>
  )
}
