'use client'

import { useEffect } from 'react'
import '../styles/home.css'

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
        <footer className="st-home-footer">
          <a href="https://instagram.com/studiotalent" target="_blank" rel="noopener noreferrer" className="st-home-footer-link">Follow me</a>
          <a href="/contact" className="st-home-footer-link">Write me</a>
          <a href="/privacy" className="st-home-footer-link">Privacy policy</a>
        </footer>
      </div>

      {/* Right column: body text pinned to bottom */}
      <div className="st-home-right">
        <div className="st-home-text">
          <p className="st-home-intro">
            <span className="st-intro-light">Lorem ipsum dolor sit </span>
            <span className="st-intro-bold">L&rsquo;architettura diventa interior design.</span>
            <span className="st-intro-light"> Studiamo e progettiamo lo spazio su misura per te.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
