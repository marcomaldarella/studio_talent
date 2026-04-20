'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TransitionLink from './TransitionLink'
import '../styles/cookie.css'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!localStorage.getItem('st-cookies')) setVisible(true)
  }, [])

  useEffect(() => {
    const el = bannerRef.current
    if (!el || !visible) return
    gsap.fromTo(el,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.8 }
    )
  }, [visible])

  const dismiss = (value: string) => {
    const el = bannerRef.current
    if (el) {
      gsap.to(el, {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setVisible(false),
      })
    } else {
      setVisible(false)
    }
    localStorage.setItem('st-cookies', value)
  }

  if (!visible) return null

  return (
    <div ref={bannerRef} className="st-cookie" style={{ opacity: 0 }}>
      <p className="st-cookie-text">
        Utilizziamo cookie per migliorare la navigazione.
      </p>
      <div className="st-cookie-actions">
        <TransitionLink href="/privacy" className="st-cookie-privacy">Privacy</TransitionLink>
        <div className="st-cookie-btns">
          <button onClick={() => dismiss('0')} className="st-cookie-reject">Rifiuta</button>
          <button onClick={() => dismiss('1')} className="st-cookie-accept">Accetta</button>
        </div>
      </div>
    </div>
  )
}
