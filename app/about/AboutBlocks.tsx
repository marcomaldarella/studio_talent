'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import '../../styles/about.css'

const BLOCKS = [
  <>
    <span className="st-about-text-bold">Studio Talent si muove su un confine sottile. </span>
    <span className="st-about-text-light">Tra architettura e racconto. </span>
    <span className="st-about-text-bold">Tra funzione e percezione.</span>
  </>,
  <>
    <span className="st-about-text-bold">Dialoga con i luoghi, ma soprattutto con chi li abiterà. </span>
    <span className="st-about-text-light">Perché ogni progetto nasce, prima di tutto, come relazione.</span>
  </>,
  <>
    <span className="st-about-text-bold">E ogni spazio riuscito è quello in cui ci si riconosce, senza bisogno di spiegazioni. </span>
    <span className="st-about-text-light">Il talento prende forma così: nell&rsquo;incontro con chi è disposto ad aprirsi, a farsi leggere, e a lasciare che lo spazio risponda.</span>
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
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.1 }
    )
  }, [])

  return (
    <div ref={containerRef} className="st-about-right">
      {BLOCKS.map((content, i) => (
        <div key={i} className="st-about-hero">
          <div className="st-about-block">
            <p className="st-about-text">{content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
