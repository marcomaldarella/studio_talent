'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import TransitionLink from '../../../components/TransitionLink'
import type { Project } from '../../../types'
import '../../../styles/work.css'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
}

export default function ProjectDetail({ project, prev, next }: Props) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  const galleryImages = (project.images ?? []).filter(Boolean)
  const images: string[] = galleryImages.length > 0
    ? galleryImages
    : (project.coverImage ? [project.coverImage] : [])
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

  const category = project.category ?? project.client ?? ''

  return (
    <main ref={mainRef} className="st-project">
      <div className="st-project-bar st-project-bar--top">
        <span className="st-project-bar-title">{project.category}</span>
        <div className="st-project-bar-actions">
          {project.city && <span className="st-project-bar-city">{project.city}</span>}
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

      <div className="st-project-bar st-project-bar--sub">
        <span className="st-project-bar-year">{project.year}</span>
      </div>

      <div className="st-project-images" ref={scrollRef}>
        {panels.map((src, i) => (
          <div key={i} className="st-project-img-wrap">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={`${project.title} ${i + 1}`}
                className="st-project-img"
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
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
