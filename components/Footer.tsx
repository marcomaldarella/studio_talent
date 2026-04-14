'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TransitionLink from './TransitionLink'
import '../styles/footer.css'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const links = Array.from(el.querySelectorAll<HTMLElement>('a'))
    gsap.fromTo(
      links,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07, delay: 0.1 }
    )
  }, [])

  return (
    <footer ref={footerRef} className="st-footer">
      <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-footer-link">Follow me</a>
      <TransitionLink href="/contact" className="st-footer-link">Write me</TransitionLink>
      <TransitionLink href="/privacy" className="st-footer-link">Privacy policy</TransitionLink>
    </footer>
  )
}
