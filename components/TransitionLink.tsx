'use client'

import { useCurtain } from './CurtainProvider'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  children: ReactNode
}

/**
 * Drop-in replacement for <Link> / <a> that plays the page curtain
 * animation before navigating. Falls back to normal behaviour for
 * external URLs and modifier-key clicks (cmd/ctrl/shift).
 */
export default function TransitionLink({ href, children, onClick, ...rest }: Props) {
  const { navigateTo } = useCurtain()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    // Let external links and modified clicks pass through normally
    if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigateTo(href)
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
