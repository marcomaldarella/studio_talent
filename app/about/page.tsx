import type { Metadata } from 'next'
import Footer from '../../components/Footer'
import '../../styles/about.css'

export const metadata: Metadata = { title: 'About' }

const BLOCKS = [
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
  <>
    <span className="st-about-text-light">Lorem ipsum dolor sit </span>
    <span className="st-about-text-bold">L&rsquo;architettura diventa interior design.</span>
    {' '}
    <span className="st-about-text-light">Studiamo e progettiamo lo spazio su misura per te.</span>
  </>,
]

export default function AboutPage() {
  return (
    <main className="st-about">
      <div className="st-about-body">
        <div className="st-about-left" />
        <div className="st-about-right">
          {BLOCKS.map((content, i) => (
            <div key={i} className="st-about-block">
              <p className="st-about-text">{content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
