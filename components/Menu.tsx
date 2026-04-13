'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import '../styles/menu.css'

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Menu({ isOpen, onClose }: MenuProps) {
  const router = useRouter()

  const handleNav = (href: string) => {
    onClose()
    setTimeout(() => router.push(href), 200)
  }

  return (
    <div className={`st-menu-overlay${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
      <div className="st-menu-header">
        <Link href="/" className="st-menu-logo" onClick={onClose}>
          Studio Talent
        </Link>
        <button className="st-close-btn" onClick={onClose}>
          [Close]
        </button>
      </div>
      <nav className="st-menu-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            className="st-nav-item"
            onClick={() => handleNav(item.href)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="st-menu-footer">
        <span>© {new Date().getFullYear()} Studio Talent</span>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="st-menu-footer-link"
        >
          Instagram
        </a>
      </div>
    </div>
  )
}
