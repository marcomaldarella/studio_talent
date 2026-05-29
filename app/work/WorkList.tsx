'use client'

import React, { useEffect, useRef } from 'react'
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

    // GSAP entrance — runs immediately
    const workItems = Array.from(el.querySelectorAll<HTMLElement>('.st-work-item'))
    const returnSlug = sessionStorage.getItem('work_return_slug')
    if (returnSlug) {
      sessionStorage.removeItem('work_return_slug')
      gsap.set(workItems, { y: 0, opacity: 1 })
      const target = el.querySelector<HTMLElement>(`[data-slug="${returnSlug}"]`)
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'center' })
    } else {
      gsap.fromTo(
        workItems,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
      )
    }

    // iOS Safari discards the scroll compositing layer when a position:fixed
    // fullscreen drawer is shown. The drawer becomes display:none at ~260ms
    // after navigation. Wait 350ms then force a teardown + rebuild of the layer.
    let raf1 = 0, raf2 = 0
    const timer = setTimeout(() => {
      el.style.overflowY = 'hidden'
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          el.style.overflowY = ''
          el.scrollTop = 0
        })
      })
    }, 350)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  return (
    <div ref={listRef} className="st-work-list-right">
      {items.map((p, i) => (
        <TransitionLink
          key={p._id}
          href={p.slug ? `/work/${p.slug.current}` : '#'}
          className="st-work-item"
          data-slug={p.slug?.current}
          style={{ '--i': i } as React.CSSProperties}
          onClick={() => { if (p.slug?.current) sessionStorage.setItem('work_return_slug', p.slug.current) }}
        >
          <div className="st-work-item-header">
            <span className="st-work-item-title">{p.category}</span>
            {p.city && <span className="st-work-item-city">{p.city}</span>}
          </div>
          <div className="st-work-item-meta">
            <span className="st-work-item-year">{p.year}</span>
          </div>
          <div className="st-work-item-thumb-wrap">
            {p.coverImage ? (
              <Image
                src={p.coverImage}
                alt={p.title}
                width={400}
                height={540}
                className="st-work-item-thumb"
                priority={i === 0}
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
