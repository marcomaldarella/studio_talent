'use client'

import { createContext, useContext, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type CurtainCtx = { navigateTo: (href: string) => void }
const CurtainContext = createContext<CurtainCtx>({ navigateTo: () => {} })
export function useCurtain() { return useContext(CurtainContext) }

// Curtain fades in over IN ms, router.push fires, then curtain fades out over OUT ms
const IN = 180
const OUT = 260

export function CurtainProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const curtainRef = useRef<HTMLDivElement>(null)
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigateTo = useCallback((href: string) => {
    const el = curtainRef.current
    if (!el) { router.push(href); return }

    // Cancel any in-flight transition
    if (t1.current) clearTimeout(t1.current)
    if (t2.current) clearTimeout(t2.current)
    if (t3.current) clearTimeout(t3.current)

    // Fade in — covers old page + closing drawer
    el.style.transition = `opacity ${IN}ms ease-in`
    el.style.opacity = '1'
    el.style.pointerEvents = 'all'

    // Navigate once curtain is opaque
    t1.current = setTimeout(() => {
      router.push(href)

      // Brief hold — let Next.js swap the page under the curtain
      t2.current = setTimeout(() => {
        el.style.transition = `opacity ${OUT}ms ease-out`
        el.style.opacity = '0'

        t3.current = setTimeout(() => {
          el.style.pointerEvents = 'none'
        }, OUT)
      }, 40)
    }, IN)
  }, [router])

  return (
    <CurtainContext.Provider value={{ navigateTo }}>
      {children}
      {/* Full-screen overlay — z-index above drawer (200) */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          background: 'var(--bg, #ffffff)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </CurtainContext.Provider>
  )
}
