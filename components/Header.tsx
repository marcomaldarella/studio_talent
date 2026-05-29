'use client'

import { useState, useEffect, useRef } from 'react'
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
  const drawerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeItem = NAV.find(({ href }) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))
  )

  const openDrawer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
    // Remove display:none before starting the fade-in
    const el = drawerRef.current
    if (el) el.style.display = ''
    requestAnimationFrame(() => setOpen(true))
  }

  const closeDrawer = () => {
    setOpen(false)
    // After the fade-out animation (220ms), set display:none so iOS releases
    // the compositing layer and can restore scroll layers in child pages.
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (drawerRef.current) drawerRef.current.style.display = 'none'
    }, 260)
  }

  // On mount: drawer starts display:none (SSR renders it as opacity:0 flex)
  useEffect(() => {
    if (drawerRef.current) drawerRef.current.style.display = 'none'
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current) }
  }, [])

  // On navigation: close drawer and schedule display:none
  useEffect(() => {
    setOpen(false)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (drawerRef.current) drawerRef.current.style.display = 'none'
    }, 260)
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

      {/* Mobile drawer — display:none when closed, so iOS releases the
          fixed-position compositing layer and scroll containers work. */}
      <div ref={drawerRef} className={`st-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
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
