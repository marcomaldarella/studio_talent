'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TransitionLink from '../components/TransitionLink'
import '../styles/home.css'

const INTRO_SEGMENTS: { text: string; cls: string; br?: boolean; mobileBr?: boolean }[] = [
  { text: 'Lorem ipsum dolor sit', cls: 'st-intro-light', br: true },
  { text: 'L\u2019architettura diventa interior design. ', cls: 'st-intro-bold' },
  { text: 'Studiamo e progettiamo lo spazio su misura per te.', cls: 'st-intro-light' },
]

export default function HomePage() {
  const footerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)

  // No scroll on homepage
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  useEffect(() => {
    const links = footerRef.current
      ? Array.from(footerRef.current.querySelectorAll<HTMLElement>('a'))
      : []
    gsap.fromTo(
      links,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07, delay: 0.5 }
    )

    const chars = introRef.current
      ? Array.from(introRef.current.querySelectorAll<HTMLElement>('.ic'))
      : []
    gsap.set(chars, { y: 20, opacity: 0 })
    gsap.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.016,
      delay: 0.25,
    })
  }, [])

  return (
    <main className="st-home">
      {/* Left column: footer links pinned to bottom */}
      <div className="st-home-left">
        <footer className="st-home-footer">
          <div ref={footerRef} className="st-home-footer-inner">
            <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-home-footer-link">Follow me</a>
            <TransitionLink href="/contact" className="st-home-footer-link">Write me</TransitionLink>
            <TransitionLink href="/privacy" className="st-home-footer-link">Privacy policy</TransitionLink>
          </div>
        </footer>
      </div>

      {/* Right column: body text pinned to bottom */}
      <div className="st-home-right">
        <div className="st-home-text">
          <p ref={introRef} className="st-home-intro">
            {INTRO_SEGMENTS.map(({ text, cls, br, mobileBr }, si) => {
              const words = text.trim().split(' ')
              return (
                <span key={si}>
                  {words.map((word, wi) => (
                    <span key={wi}>
                      {/* word wrapper — inline-block + nowrap prevents mid-word breaks */}
                      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        {word.split('').map((ch, ci) => (
                          <span
                            key={ci}
                            className={`ic ${cls}`}
                            style={{ display: 'inline-block' }}
                          >
                            {ch}
                          </span>
                        ))}
                      </span>
                      {/* plain text space — stretchable by justify */}
                      {wi < words.length - 1 && ' '}
                    </span>
                  ))}
                  {/* space between segments */}
                  {!br && !mobileBr && si < INTRO_SEGMENTS.length - 1 && ' '}
                  {br && <br />}
                  {mobileBr && <span className="home-br-mobile" />}
                </span>
              )
            })}
          </p>
        </div>
      </div>
    </main>
  )
}
