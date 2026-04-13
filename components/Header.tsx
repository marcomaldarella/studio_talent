'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../styles/header.css'

interface HeaderProps {
  onMenuOpen: () => void
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname()

  const sectionLabel =
    pathname.startsWith('/work') ? 'Work' :
    pathname === '/about' ? 'About' :
    pathname === '/contact' ? 'Contact' : null

  return (
    <header className="st-header">
      <div className="st-header-inner">
        <Link href="/" className="st-logo">
          Studio Talent
        </Link>
        <button className="st-menu-btn" onClick={onMenuOpen}>
          [Menu]
        </button>
      </div>
      {sectionLabel && (
        <div className="st-sub-bar">
          <span className="st-section-label">
            {sectionLabel}
            <span className="st-section-dot" />
          </span>
        </div>
      )}
    </header>
  )
}
