'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import type { PressItem } from '../../types'
import '../../styles/press.css'

const PLACEHOLDERS: PressItem[] = [
  { _id: 'ph1', publication: 'AD Italia', year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph2', publication: 'Domus', year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph3', publication: 'Abitare', year: 2025, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
]

export default function PressList({ items }: { items: PressItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  const list = items.length > 0 ? items : PLACEHOLDERS
  const hovered = list.find((p) => p._id === hoveredId)

  // Entrance animation
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const pressItems = Array.from(el.querySelectorAll<HTMLElement>('.st-press-item'))
    gsap.fromTo(
      pressItems,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04, delay: 0.05 }
    )
  }, [])

  // Floating image: follow cursor on desktop
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    const el = floatRef.current
    if (!el) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      gsap.to(el, {
        x: mousePos.current.x + 24,
        y: mousePos.current.y - 60,
        duration: 0.45,
        ease: 'power3.out',
      })
    })
  }, [])

  // Show/hide float image
  useEffect(() => {
    const el = floatRef.current
    if (!el) return
    const hasImg = !!hovered?.coverImage
    gsap.to(el, {
      opacity: hasImg ? 1 : 0,
      scale: hasImg ? 1 : 0.92,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [hoveredId, hovered])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <>
      {/* Cursor-following image — desktop only, fixed positioning */}
      <div
        ref={floatRef}
        className="st-press-float-img-wrap"
        style={{ opacity: 0, scale: '0.92' } as React.CSSProperties}
      >
        {hovered?.coverImage && (
          <Image
            src={hovered.coverImage}
            alt={hovered.publication}
            width={140}
            height={185}
            className="st-press-float-img"
          />
        )}
      </div>

      <div className="st-press-body" onMouseMove={onMouseMove}>
        {/* Left column spacer — desktop layout */}
        <div className="st-press-left" />

        {/* Right column: list */}
        <div ref={listRef} className="st-press-list">
          {list.map((item) => {
            const isOpen = openId === item._id
            const hasImage = !!item.coverImage

            return (
              <div
                key={item._id}
                className="st-press-item"
                onMouseEnter={() => setHoveredId(item._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Header row */}
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

                {/* Expanded image — mobile only */}
                {hasImage && (
                  <div className={`st-press-item-expand${isOpen ? ' is-open' : ''}`}>
                    <Image
                      src={item.coverImage!}
                      alt={item.publication}
                      width={320}
                      height={420}
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
