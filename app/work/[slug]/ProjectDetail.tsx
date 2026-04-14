'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import TransitionLink from '../../../components/TransitionLink'
import type { Project } from '../../../types'
import '../../../styles/work.css'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
}

const COPIES = 3

export default function ProjectDetail({ project, prev, next }: Props) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  const images: string[] = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.images ?? []).filter(Boolean),
  ]
  const panels = images.length > 0 ? images : ['', '', '']

  // Entrance animation ref
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const bars = Array.from(el.querySelectorAll<HTMLElement>('.st-project-bar'))
    gsap.fromTo(
      bars,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.05 }
    )
    const images = el.querySelector<HTMLElement>('.st-project-images')
    if (images) {
      gsap.fromTo(
        images,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.25 }
      )
    }
  }, [])

  // Progress indicator (mobile only): which panel + fill within it
  const [progress, setProgress] = useState({ panel: 0, fill: 0 })

  // Infinite scroll ref
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Init: start at middle copy
    const init = () => {
      const setWidth = el.scrollWidth / COPIES
      el.scrollLeft = setWidth
    }
    const raf = requestAnimationFrame(init)

    const onScroll = () => {
      const setWidth = el.scrollWidth / COPIES
      if (el.scrollLeft < setWidth * 0.5) {
        el.scrollLeft += setWidth
      } else if (el.scrollLeft >= setWidth * 2) {
        el.scrollLeft -= setWidth
      }
      // Progress: which panel + how much of it is filled
      const posInSet = el.scrollLeft % setWidth
      const panelWidth = setWidth / panels.length
      const panel = Math.floor(posInSet / panelWidth)
      const fill = (posInSet % panelWidth) / panelWidth
      setProgress({ panel, fill })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY + e.deltaX
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
    }
  }, [panels.length])

  const category = project.category ?? project.client ?? ''

  // Triple panels for infinite loop
  const loopedPanels = [...panels, ...panels, ...panels]

  return (
    <main ref={mainRef} className="st-project">
      {/* Bar 1: title | prev/next | close */}
      <div className="st-project-bar st-project-bar--top">
        <span className="st-project-bar-title">{project.title}</span>
        <div className="st-project-bar-actions">
          {prev ? (
            <TransitionLink href={`/work/${prev.slug.current}`} className="st-project-nav-btn" aria-label="Previous">&lt;</TransitionLink>
          ) : (
            <span className="st-project-nav-btn st-project-nav-btn--disabled">&lt;</span>
          )}
          {next ? (
            <TransitionLink href={`/work/${next.slug.current}`} className="st-project-nav-btn" aria-label="Next">&gt;</TransitionLink>
          ) : (
            <span className="st-project-nav-btn st-project-nav-btn--disabled">&gt;</span>
          )}
          <TransitionLink href="/work" className="st-project-close">Close</TransitionLink>
        </div>
      </div>

      {/* Bar 2: year | category */}
      <div className="st-project-bar st-project-bar--sub">
        <span className="st-project-bar-year">{project.year}</span>
        {category && <span className="st-project-bar-category">{category}</span>}
      </div>

      {/* Infinite horizontal scroll */}
      <div className="st-project-images" ref={scrollRef}>
        {loopedPanels.map((src, i) => (
          <div key={i} className="st-project-img-wrap">
            {src ? (
              <Image
                src={src}
                alt={`${project.title} ${(i % panels.length) + 1}`}
                fill
                className="st-project-img"
                sizes="33vw"
                priority={i < panels.length}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Segmented progress — mobile only, one segment per photo */}
      <div className="st-project-progress">
        {panels.map((_, i) => (
          <div key={i} className="st-project-progress-track">
            <div
              className="st-project-progress-fill"
              style={{
                width: i < progress.panel
                  ? '100%'
                  : i === progress.panel
                    ? `${progress.fill * 100}%`
                    : '0%',
              }}
            />
          </div>
        ))}
      </div>
    </main>
  )
}
