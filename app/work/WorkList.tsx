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

    const workItems = Array.from(el.querySelectorAll<HTMLElement>('.st-work-item'))
    const returnSlug = sessionStorage.getItem('work_return_slug')

    // scrollTop to restore after the iOS layer rebuild (350ms timer).
    // Default 0 = normal navigation. When returning from a project, we use
    // the exact position saved at click time — not scrollIntoView, because
    // the scroll layer is broken at this point and the value would be lost
    // when the timer resets scrollTop.
    let restoreTop = 0

    if (returnSlug) {
      sessionStorage.removeItem('work_return_slug')
      const saved = parseInt(sessionStorage.getItem('work_scroll_top') ?? '0', 10)
      sessionStorage.removeItem('work_scroll_top')
      restoreTop = isNaN(saved) ? 0 : saved
      gsap.set(workItems, { y: 0, opacity: 1 })
    } else {
      gsap.fromTo(
        workItems,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
      )
    }

    // iOS Safari discards the scroll compositing layer when a position:fixed
    // fullscreen element (drawer, curtain) is shown. Wait for those elements
    // to become display:none (~260ms), then force a layer teardown + rebuild.
    let raf1 = 0, raf2 = 0
    const timer = setTimeout(() => {
      el.style.overflowY = 'hidden'
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          el.style.overflowY = ''
          el.scrollTop = restoreTop
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
          onClick={() => {
            if (p.slug?.current) {
              sessionStorage.setItem('work_return_slug', p.slug.current)
              // Save exact scroll position now (layer is still working at click time)
              sessionStorage.setItem('work_scroll_top', String(listRef.current?.scrollTop ?? 0))
            }
          }}
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
