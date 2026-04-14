'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import '../styles/home.css'

const ease = [0.25, 0.1, 0.25, 1] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
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
        {/* border-top is on the static footer element, NOT on the animated wrapper */}
        <footer className="st-home-footer">
          <motion.div className="st-home-footer-inner" {...fadeUp(0.55)}>
            <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-home-footer-link">Follow me</a>
            <a href="/contact" className="st-home-footer-link">Write me</a>
            <a href="/privacy" className="st-home-footer-link">Privacy policy</a>
          </motion.div>
        </footer>
      </div>

      {/* Right column: body text pinned to bottom */}
      <div className="st-home-right">
        {/* border-top is on the static wrapper, NOT on the animated paragraph */}
        <div className="st-home-text">
          <motion.p className="st-home-intro" {...fadeUp(0.4)}>
            <span className="st-intro-light">Lorem ipsum dolor sit </span>
            <span className="st-intro-bold">L&rsquo;architettura diventa interior design.</span>
            <span className="st-intro-light"> Studiamo e progettiamo lo spazio su misura per te.</span>
          </motion.p>
        </div>
      </div>
    </main>
  )
}
