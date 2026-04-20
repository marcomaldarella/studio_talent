'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import type { PressItem } from '../../types'
import TransitionLink from '../../components/TransitionLink'
import '../../styles/press.css'

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const PLACEHOLDERS: PressItem[] = [
  { _id: 'ph1', publication: 'AD Italia',  year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph2', publication: 'Domus',       year: 2026, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { _id: 'ph3', publication: 'Abitare',     year: 2025, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
]

export default function PressList({ items }: { items: PressItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [displayItem, setDisplayItem] = useState<PressItem | null>(null)

  const listRef     = useRef<HTMLDivElement>(null)
  // Outer wrapper: RAF writes translate3d here (position only)
  const floatPosRef = useRef<HTMLDivElement>(null)
  // Inner wrapper: GSAP writes scale + opacity here (never transform)
  const floatWrapRef = useRef<HTMLDivElement>(null)

  // Physics state — raw refs, zero re-renders
  const mouse  = useRef({ x: 0, y: 0 })
  const pos    = useRef({ x: 0, y: 0 })
  const raf    = useRef<number | null>(null)
  const isHovering = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const list = items.length > 0 ? items : PLACEHOLDERS

  // ─── Entrance stagger
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    gsap.fromTo(
      Array.from(el.querySelectorAll<HTMLElement>('.st-press-item')),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04, delay: 0.05 }
    )
  }, [])

  // ─── Global mouse tracker
  useEffect(() => {
    let initialised = false
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!initialised) {
        pos.current = { x: e.clientX, y: e.clientY }
        initialised = true
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ─── RAF loop — runs only while hovering, writes ONLY translate3d
  const startLoop = useCallback(() => {
    if (raf.current) return
    const AMT = 0.15

    const loop = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, AMT)
      pos.current.y = lerp(pos.current.y, mouse.current.y, AMT)

      const el = floatPosRef.current
      if (el) {
        el.style.transform = `translate3d(${pos.current.x + 24}px,${pos.current.y - 60}px,0)`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
  }, [])

  const stopLoop = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current)
      raf.current = null
    }
  }, [])

  // ─── Show image: scale 0.85 → 1 + opacity 0 → 1
  const showImage = useCallback((item: PressItem) => {
    if (!item.coverImage) return
    setDisplayItem(item)
    const wrap = floatWrapRef.current
    if (!wrap) return
    gsap.killTweensOf(wrap)
    gsap.fromTo(wrap,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out' }
    )
  }, [])

  // ─── Hide image: scale + fade out
  const hideImage = useCallback(() => {
    const wrap = floatWrapRef.current
    if (!wrap) return
    gsap.killTweensOf(wrap)
    gsap.to(wrap, {
      opacity: 0,
      scale: 0.88,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: stopLoop,
    })
  }, [stopLoop])

  // ─── Hover handlers
  const handleMouseEnter = useCallback((item: PressItem) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    const wasHovering = isHovering.current
    isHovering.current = true
    setHoveredId(item._id)

    // Snap pos to cursor on first enter (avoids flying in from last position)
    pos.current = { x: mouse.current.x, y: mouse.current.y }

    startLoop()

    // If already hovering another row: re-trigger show animation (row switch)
    if (wasHovering) {
      showImage(item)
    } else {
      // Small delay like the original (100ms) before revealing
      timeoutRef.current = setTimeout(() => {
        showImage(item)
      }, 60)
    }
  }, [startLoop, showImage])

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false
    setHoveredId(null)
    hideImage()
  }, [hideImage])

  // cleanup
  useEffect(() => () => {
    stopLoop()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [stopLoop])

  return (
    <>
      {/* Outer: position via RAF translate3d — GSAP never touches this */}
      <div ref={floatPosRef} className="st-press-float-pos">
        {/* Inner: scale + opacity via GSAP — RAF never touches this */}
        <div ref={floatWrapRef} className="st-press-float-wrap">
          {displayItem?.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayItem.coverImage}
              alt={displayItem.publication}
              className="st-press-float-img"
            />
          )}
        </div>
      </div>

      <div className="st-press-body">
        <div className="st-press-left" />
        <div ref={listRef} className="st-press-list" onMouseLeave={handleMouseLeave}>
          {list.map((item, index) => {
            const slug = item.slug?.current
            const ItemWrapper = slug ? TransitionLink : 'div'
            const wrapperProps = slug
              ? { href: `/press/${slug}`, className: 'st-press-item', style: { '--i': index } as React.CSSProperties }
              : { className: 'st-press-item', style: { '--i': index } as React.CSSProperties }

            return (
              <ItemWrapper
                key={item._id}
                {...(wrapperProps as React.ComponentProps<typeof TransitionLink>)}
                onMouseEnter={() => handleMouseEnter(item)}
              >
                <div className="st-press-item-header">
                  <span className="st-press-item-pub">
                    {hoveredId === item._id && <span className="st-press-active-dot">■</span>}
                    {item.publication}
                  </span>
                </div>

                <div className="st-press-item-meta">
                  <span className="st-press-item-year">{item.year}</span>
                  {item.description && (
                    <span className="st-press-item-desc">{item.description}</span>
                  )}
                </div>
              </ItemWrapper>
            )
          })}
        </div>
      </div>
    </>
  )
}
