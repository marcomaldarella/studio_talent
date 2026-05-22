'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import CookieBanner from './CookieBanner'
import { CurtainProvider } from './CurtainProvider'
import ScreenHeightFix from './ScreenHeightFix'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith('/studio')
  return (
    <CurtainProvider>
      <ScreenHeightFix />
      {!isStudio && <Header />}
      {children}
      {!isStudio && <CookieBanner />}
    </CurtainProvider>
  )
}
