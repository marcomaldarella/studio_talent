'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import TransitionLink from '../../../components/TransitionLink'
import type { PressItem } from '../../../types'
import '../../../styles/work.css'

interface Props {
  item: PressItem
  prev: PressItem | null
  next: PressItem | null
}

export default function PressDetail({ item, prev, next }: Props) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  // Build image list: coverImage + gallery images
  // If no gallery images, duplicate coverImage 3× (as requested)
  const galleryImages: string[] = (item.images ?? []).filter(Boolean)
  const allImages: string[] = [
    ...(item.coverImage ? [item.coverImage] : []),
    ...galleryImages,
  ]
  const panels = allImages.length > 0
    ? (allImages.length === 1 ? [allImages[0], allImages[0], allImages[0]] : allImages)
    : ['', '', '']

  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const bars = Array.from(el.querySelectorAll<HTMLElement>('.st-project-bar'))
    gsap.fromTo(bars,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
    )
    const imgs = el.querySelector<HTMLElement>('.st-project-images')
    if (imgs) {
      gsap.fromTo(imgs,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.25 }
      )
    }
  }, [])

  const [progress, setProgress] = useState({ panel: 0, fill: 0 })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth
      const ratio = maxScroll > 0 ? el.scrollLeft / maxScroll : 0
      const panelFloat = ratio * panels.length
      const panel = Math.min(Math.floor(panelFloat), panels.length - 1)
      const fill = panelFloat - Math.floor(Math.min(panelFloat, panels.length - 1))
      setProgress({ panel, fill })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY + e.deltaX
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
    }
  }, [panels.length])

  return (
    <main ref={mainRef} className="st-project">
      <div className="st-project-bar st-project-bar--top">
        <span className="st-project-bar-title">{item.publication}</span>
        <div className="st-project-bar-actions">
          {prev?.slug ? (
            <TransitionLink href={`/press/${prev.slug.current}`} className="st-project-nav-btn" aria-label="Previous">&lt;</TransitionLink>
          ) : (
            <span className="st-project-nav-btn st-project-nav-btn--disabled">&lt;</span>
          )}
          {next?.slug ? (
            <TransitionLink href={`/press/${next.slug.current}`} className="st-project-nav-btn" aria-label="Next">&gt;</TransitionLink>
          ) : (
            <span className="st-project-nav-btn st-project-nav-btn--disabled">&gt;</span>
          )}
          <TransitionLink href="/press" className="st-project-close">Close</TransitionLink>
        </div>
      </div>

      <div className="st-project-bar st-project-bar--sub">
        <span className="st-project-bar-year">{item.year}</span>
        {item.description && <span className="st-project-bar-category">{item.description}</span>}
      </div>

      <div className="st-project-images" ref={scrollRef}>
        {panels.map((src, i) => (
          <div key={i} className="st-project-img-wrap">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${item.publication} ${i + 1}`}
                className="st-project-img"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="st-project-progress">
        {panels.map((_, i) => (
          <div key={i} className="st-project-progress-track">
            <div
              className="st-project-progress-fill"
              style={{
                width: i < progress.panel ? '100%' : i === progress.panel ? `${progress.fill * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
