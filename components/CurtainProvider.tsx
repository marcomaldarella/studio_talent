'use client'

import { createContext, useContext, useCallback, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type CurtainCtx = { navigateTo: (href: string) => void }
const CurtainContext = createContext<CurtainCtx>({ navigateTo: () => {} })
export function useCurtain() { return useContext(CurtainContext) }

const IN = 180
const OUT = 260

export function CurtainProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const navigatingRef = useRef(false)
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startFadeOut = useCallback(() => {
    navigatingRef.current = false
    if (t2.current) clearTimeout(t2.current)
    const el = curtainRef.current
    if (!el) return
    el.style.transition = `opacity ${OUT}ms ease-out`
    el.style.opacity = '0'
    t3.current = setTimeout(() => {
      el.style.pointerEvents = 'none'
      el.style.display = 'none'
    }, OUT)
  }, [])

  // usePathname updates when React commits the new page tree — the real end of
  // navigation. Waiting for it (instead of a fixed 40ms) prevents the flash
  // caused by fading the curtain before the new content is ready.
  useEffect(() => {
    if (navigatingRef.current) startFadeOut()
  }, [pathname, startFadeOut])

  const navigateTo = useCallback((href: string) => {
    const el = curtainRef.current
    if (!el) { router.push(href); return }

    if (t1.current) clearTimeout(t1.current)
    if (t2.current) clearTimeout(t2.current)
    if (t3.current) clearTimeout(t3.current)
    navigatingRef.current = false

    // Un-hide the curtain, then start the fade-in next frame
    // (display:none → block must happen before the transition kicks in)
    el.style.display = 'block'
    el.style.transition = 'none'
    el.style.opacity = '0'

    requestAnimationFrame(() => {
      el.style.transition = `opacity ${IN}ms ease-in`
      el.style.opacity = '1'
      el.style.pointerEvents = 'all'

      t1.current = setTimeout(() => {
        navigatingRef.current = true
        router.push(href)

        // Safety fallback: if pathname never changes (same page, redirect, etc.)
        // fade out after 2 s so the curtain doesn't stay up forever.
        t2.current = setTimeout(startFadeOut, 2000)
      }, IN)
    })
  }, [router, startFadeOut])

  return (
    <CurtainContext.Provider value={{ navigateTo }}>
      {children}
      {/* display:none by default — no position:fixed layer on iOS when idle */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          background: 'var(--bg, #ECEBE7)',
          opacity: 0,
          pointerEvents: 'none',
          display: 'none',
        }}
      />
    </CurtainContext.Provider>
  )
}
