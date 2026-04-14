'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import CookieBanner from './CookieBanner'
import { CurtainProvider } from './CurtainProvider'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')
  return (
    <CurtainProvider>
      {!isStudio && <Header />}
      {children}
      {!isStudio && <CookieBanner />}
    </CurtainProvider>
  )
}
