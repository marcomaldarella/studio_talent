'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import type { PressItem } from '../../types'
import '../../styles/press.css'

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const PLACEHOLDERS: PressItem[] = [
  { _id: 'ph1', publication: 'AD Italia', year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph2', publication: 'Domus', year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph3', publication: 'Abitare', year: 2025, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
]

export default function PressList({ items }: { items: PressItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  // keep last image visible during fade-out
  const [displayItem, setDisplayItem] = useState<PressItem | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)

  // Physics
  const mouse = useRef({ x: 0, y: 0, init: false })
  const pos   = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  const list = items.length > 0 ? items : PLACEHOLDERS

  // ── Entrance stagger
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    gsap.fromTo(
      Array.from(el.querySelectorAll<HTMLElement>('.st-press-item')),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04, delay: 0.05 }
    )
  }, [])

  // ── Global mouse tracker (window, not container — avoids gaps between rows)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!mouse.current.init) {
        // first move: snap position so image doesn't fly in from 0,0
        pos.current = { x: e.clientX, y: e.clientY }
        mouse.current.init = true
      }
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Continuous lerp RAF loop
  useEffect(() => {
    const AMT = 0.08 // lower = more lag / inertia

    const loop = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, AMT)
      pos.current.y = lerp(pos.current.y, mouse.current.y, AMT)

      const el = floatRef.current
      if (el) {
        el.style.transform = `translate3d(${pos.current.x + 24}px, ${pos.current.y - 60}px, 0)`
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  // ── Hover handlers
  const handleMouseEnter = useCallback((item: PressItem) => {
    setHoveredId(item._id)
    if (item.coverImage) setDisplayItem(item)
    const el = floatRef.current
    if (!el || !item.coverImage) return
    gsap.killTweensOf(el)
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
    const el = floatRef.current
    if (!el) return
    gsap.killTweensOf(el)
    gsap.to(el, { opacity: 0, scale: 0.88, duration: 0.35, ease: 'power2.in' })
  }, [])

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <>
      {/* Physics cursor image — desktop only, fixed so transform is relative to viewport */}
      <div
        ref={floatRef}
        className="st-press-float-img-wrap"
        style={{ opacity: 0, transform: 'translate3d(0,0,0)', willChange: 'transform, opacity' }}
      >
        {displayItem?.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayItem.coverImage}
            alt={displayItem.publication}
            className="st-press-float-img"
          />
        )}
      </div>

      <div className="st-press-body">
        <div className="st-press-left" />

        <div ref={listRef} className="st-press-list">
          {list.map((item) => {
            const isOpen = openId === item._id
            const hasImage = !!item.coverImage

            return (
              <div
                key={item._id}
                className="st-press-item"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Header row — click to toggle accordion (mobile) */}
                <div
                  className="st-press-item-header"
                  onClick={() => toggleOpen(item._id)}
                  role="button"
                  aria-expanded={isOpen}
                >
                  <span className="st-press-item-pub">
                    {hoveredId === item._id && <span className="st-press-active-dot">■</span>}
                    {item.publication}
                  </span>
                </div>

                {/* Meta row */}
                <div className="st-press-item-meta">
                  <span className="st-press-item-year">{item.year}</span>
                  {item.description && (
                    <span className="st-press-item-desc">{item.description}</span>
                  )}
                </div>

                {/* Accordion expand — mobile only */}
                {hasImage && (
                  <div className={`st-press-item-expand${isOpen ? ' is-open' : ''}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverImage!}
                      alt={item.publication}
                      className="st-press-item-expand-img"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
