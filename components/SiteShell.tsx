'use client'

import { useState } from 'react'
import Header from './Header'
import Menu from './Menu'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
    </>
  )
}
