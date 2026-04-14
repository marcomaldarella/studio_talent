'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../styles/header.css'

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/press', label: 'Press' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="st-header">
      <Link href="/" className="st-brand" aria-label="Studio Talent — Home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Studio Talent" className="st-logo" />
      </Link>
      <nav className="st-nav">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`st-nav-item${active ? ' active' : ''}`}
            >
              {active && <span className="st-nav-dot">■</span>}
              <span className="st-nav-label">{label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
