'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterConditional() {
  const pathname = usePathname()
  // Homepage has its own footer embedded in the left column
  if (pathname === '/') return null
  return <Footer />
}
