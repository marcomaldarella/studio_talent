import type { Metadata } from 'next'
import AboutBlocks from './AboutBlocks'
import '../../styles/about.css'

export const metadata: Metadata = {
  title: 'About',
  description: 'Onira is an independent film production studio by Filippo Schiaffino and Rodolfo L. Masedari, dedicated to bold stories that interrogate the forces shaping our world.',
}

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
