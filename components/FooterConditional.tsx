'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterConditional() {
  const pathname = usePathname()
  // Homepage has its own footer; studio and project detail have no footer
  if (pathname === '/' || pathname.startsWith('/studio') || pathname.startsWith('/work/') || pathname.startsWith('/press/')) return null
  return <Footer />
}
