'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '../../../types'
import '../../../styles/work.css'

interface Props {
  project: Project
  prev: Project | null
  next: Project | null
}

export default function ProjectDetail({ project, prev, next }: Props) {
  // No vertical scroll on this page
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  // Build image list: cover + gallery images
  const images: string[] = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.images ?? []),
  ]

  // Fallback placeholders
  const panels = images.length > 0 ? images : ['', '', '']

  const category = project.category ?? project.client ?? 'Lorem'

  return (
    <main className="st-project">
      {/* Info bar 1: title | prev/next | close */}
      <div className="st-project-bar st-project-bar--top">
        <span className="st-project-bar-title">{project.title}</span>
        <div className="st-project-bar-actions">
          {prev && (
            <Link href={`/work/${prev.slug.current}`} className="st-project-nav-btn" aria-label="Previous">
              &lt;
            </Link>
          )}
          {next && (
            <Link href={`/work/${next.slug.current}`} className="st-project-nav-btn" aria-label="Next">
              &gt;
            </Link>
          )}
          <Link href="/work" className="st-project-close">Close</Link>
        </div>
      </div>

      {/* Info bar 2: year | category */}
      <div className="st-project-bar st-project-bar--sub">
        <span className="st-project-bar-year">{project.year}</span>
        <span className="st-project-bar-category">{category}</span>
      </div>

      {/* Horizontal scroll images */}
      <div className="st-project-images">
        {panels.map((src, i) => (
          <div key={i} className="st-project-img-wrap">
            {src ? (
              <Image
                src={src}
                alt={`${project.title} ${i + 1}`}
                fill
                className="st-project-img"
                sizes="33vw"
                priority={i === 0}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="st-project-footer">
        <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-project-footer-link">Follow me</a>
        <a href="/contact" className="st-project-footer-link">Write me</a>
        <a href="/privacy" className="st-project-footer-link">Privacy policy</a>
      </footer>
    </main>
  )
}
