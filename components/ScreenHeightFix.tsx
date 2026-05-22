'use client'

import { useEffect } from 'react'

// Sets --screen-h to window.screen.height (CSS px) once on mount.
// screen.height is stable across navigations unlike 100lvh which
// fluctuates with Safari's address bar state.
export default function ScreenHeightFix() {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--screen-h',
      window.screen.height + 'px'
    )
  }, [])

  return null
}
