import type { Metadata } from 'next'
import AboutBlocks from './AboutBlocks'
import '../../styles/about.css'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main className="st-about">
      <div className="st-about-body">
        <div className="st-about-left" />
        <AboutBlocks />
      </div>
    </main>
  )
}
