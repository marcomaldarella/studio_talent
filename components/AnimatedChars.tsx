'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  text: string
  className?: string
  delay?: number
  letterSpacing?: string
}

/**
 * Splits `text` into individual character spans and animates them
 * in a left-to-right stagger (yPercent 110 → 0, clip-reveal style).
 * Each word is wrapped in overflow:hidden so chars appear from behind the baseline.
 */
export default function AnimatedChars({ text, className, delay = 0, letterSpacing }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = Array.from(el.querySelectorAll<HTMLElement>('.ac-c'))
    gsap.fromTo(
      chars,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.018,
        delay,
      }
    )
  }, [text, delay])

  const words = text.split(' ')

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi}>
          {/* overflow:hidden clips the yPercent travel */}
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
            {word.split('').map((char, ci) => (
              <span key={ci} className="ac-c" style={{ display: 'inline-block', letterSpacing }}>
                {char}
              </span>
            ))}
          </span>
          {wi < words.length - 1 && (
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <span className="ac-c" style={{ display: 'inline-block' }}>&nbsp;</span>
            </span>
          )}
        </span>
      ))}
    </span>
  )
}
