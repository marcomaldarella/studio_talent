'use client'

import { createContext, useContext, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type CurtainCtx = { navigateTo: (href: string) => void }
const CurtainContext = createContext<CurtainCtx>({ navigateTo: () => {} })
export function useCurtain() { return useContext(CurtainContext) }

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

    if (t1.current) clearTimeout(t1.current)
    if (t2.current) clearTimeout(t2.current)
    if (t3.current) clearTimeout(t3.current)

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
        router.push(href)

        t2.current = setTimeout(() => {
          el.style.transition = `opacity ${OUT}ms ease-out`
          el.style.opacity = '0'

          t3.current = setTimeout(() => {
            el.style.pointerEvents = 'none'
            // display:none removes it from iOS compositor — same fix as the drawer
            el.style.display = 'none'
          }, OUT)
        }, 40)
      }, IN)
    })
  }, [router])

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
