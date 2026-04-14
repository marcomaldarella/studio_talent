'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../../styles/about.css'

const BLOCKS = [
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
]

export default function AboutBlocks() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const blocks = Array.from(el.querySelectorAll<HTMLElement>('.st-about-block'))
    gsap.fromTo(
      blocks,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      }
    )
  }, [])

  return (
    <div ref={containerRef} className="st-about-right">
      {BLOCKS.map((content, i) => (
        <div key={i} className="st-about-block">
          <p className="st-about-text">{content}</p>
        </div>
      ))}
    </div>
  )
}
