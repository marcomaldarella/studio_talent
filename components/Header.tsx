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

// Best practice for iOS Safari: use position:fixed instead of overflow:hidden
// to lock body scroll. overflow:hidden causes iOS to lose scroll container
// state on subsequent navigations.
const lockBodyScroll = () => {
  const scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
}

const unlockBodyScroll = () => {
  const rawTop = document.body.style.top
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  if (rawTop) window.scrollTo(0, Math.abs(parseInt(rawTop, 10)))
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const activeItem = NAV.find(({ href }) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))
  )

  const openDrawer = () => {
    lockBodyScroll()
    setOpen(true)
  }

  const closeDrawer = () => {
    unlockBodyScroll()
    setOpen(false)
  }

  // Safety net: close drawer on any navigation (back/forward, etc.)
  useEffect(() => {
    if (document.body.style.position === 'fixed') unlockBodyScroll()
    setOpen(false)
  }, [pathname])

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
            <button className="st-menu-btn" onClick={openDrawer} aria-label="Open menu">
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
          <TransitionLink href="/" className="st-brand" aria-label="Studio Talent — Home" onClick={closeDrawer}>
            <AnimatedLogo className="st-logo" />
          </TransitionLink>
          <button className="st-drawer-close" onClick={closeDrawer} aria-label="Close menu">
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
                onClick={closeDrawer}
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
              <TransitionLink key={href} href={href} className="st-drawer-link" onClick={closeDrawer}>
                <span className="st-drawer-label">{label}</span>
              </TransitionLink>
            )
          )}
        </div>
      </div>
    </>
  )
}
