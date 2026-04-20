'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AnimatedLogo from './AnimatedLogo'
import TransitionLink from './TransitionLink'
import '../styles/header.css'

const NAV = [
  { href: '/work',    label: 'Work' },
  { href: '/about',   label: 'About' },
  { href: '/press',   label: 'Press' },
  { href: '/contact', label: 'Contact' },
]

const FOOTER_LINKS = [
  { href: 'https://instagram.com/studiotalent', label: 'Follow Me', external: true },
  { href: '/contact', label: 'Write Me' },
  { href: '/privacy', label: 'Privacy Policy' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const activeItem = NAV.find(({ href }) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))
  )

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="st-header">
        <div className="st-header-row">
          <TransitionLink href="/" className="st-brand" aria-label="Studio Talent — Home">
            <AnimatedLogo className="st-logo" />
          </TransitionLink>

          {/* Mobile: active page name (left) + [MENU] (right) */}
          <div className="st-header-meta">
            {activeItem ? (
              <span className="st-header-active">
                <span className="st-nav-label">{activeItem.label}</span>
                <span className="st-nav-dot" aria-hidden="true" />
              </span>
            ) : <span />}
            <button className="st-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
              [Menu]
            </button>
          </div>
        </div>

        <nav className="st-nav">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <TransitionLink
                key={href}
                href={href}
                className={`st-nav-item${active ? ' active' : ''}`}
              >
                <span className="st-nav-label">{label}</span>
                <span className="st-nav-dot" aria-hidden="true" />
              </TransitionLink>
            )
          })}
        </nav>
      </header>

      {/* Mobile drawer */}
      <div className={`st-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="st-drawer-head">
          <TransitionLink href="/" className="st-brand" aria-label="Studio Talent — Home">
            <AnimatedLogo className="st-logo" />
          </TransitionLink>
          <button className="st-drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            [Close]
          </button>
        </div>

        <nav className="st-drawer-nav">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <TransitionLink
                key={href}
                href={href}
                className={`st-drawer-link${active ? ' active' : ''}`}
              >
                <span className="st-drawer-label">{label}</span>
                {active && <span className="st-nav-dot" aria-hidden="true" />}
              </TransitionLink>
            )
          })}
        </nav>

        <div className="st-drawer-foot">
          {FOOTER_LINKS.map(({ href, label, external }) =>
            external ? (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="st-drawer-link">
                <span className="st-drawer-label">{label}</span>
              </a>
            ) : (
              <TransitionLink key={href} href={href} className="st-drawer-link">
                <span className="st-drawer-label">{label}</span>
              </TransitionLink>
            )
          )}
        </div>
      </div>
    </>
  )
}
