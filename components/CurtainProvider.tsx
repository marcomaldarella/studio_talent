'use client'

import { createContext, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type CurtainCtx = {
  navigateTo: (href: string) => void
}

const CurtainContext = createContext<CurtainCtx>({ navigateTo: () => {} })

export function useCurtain() {
  return useContext(CurtainContext)
}

export function CurtainProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const navigateTo = useCallback(
    (href: string) => {
      router.push(href)
    },
    [router]
  )

  return (
    <CurtainContext.Provider value={{ navigateTo }}>
      {children}
    </CurtainContext.Provider>
  )
}
