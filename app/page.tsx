'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import '../styles/home.css'

const ease = [0.25, 0.1, 0.25, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease },
})

export default function HomePage() {
  // No scroll on homepage
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = '' }
  }, [])

  return (
    <main className="st-home">
      {/* Left column: footer links pinned to bottom */}
      <div className="st-home-left">
        <motion.footer className="st-home-footer" {...fadeUp(0.55)}>
          <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-home-footer-link">Follow me</a>
          <a href="/contact" className="st-home-footer-link">Write me</a>
          <a href="/privacy" className="st-home-footer-link">Privacy policy</a>
        </motion.footer>
      </div>

      {/* Right column: body text pinned to bottom */}
      <div className="st-home-right">
        <motion.div className="st-home-text" {...fadeUp(0.4)}>
          <p className="st-home-intro">
            <span className="st-intro-light">Lorem ipsum dolor sit </span>
            <span className="st-intro-bold">L&rsquo;architettura diventa interior design.</span>
            <span className="st-intro-light"> Studiamo e progettiamo lo spazio su misura per te.</span>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
