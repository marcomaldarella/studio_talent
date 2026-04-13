import type { Metadata } from 'next'
import { client } from '../../lib/sanityClient'
import { SITE_SETTINGS_QUERY } from '../../lib/queries'
import type { SiteSettings } from '../../types'
import Footer from '../../components/Footer'
import '../../styles/about.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
}

export default async function AboutPage() {
  const settings: SiteSettings | null = await client
    .fetch(SITE_SETTINGS_QUERY)
    .catch(() => null)

  const bio =
    settings?.bio ??
    'Studio Talent is a creative agency working across film, photography, fashion, and art direction. Founded in 2020, we collaborate with emerging and established talent to produce work that challenges conventions and resonates with culture.'

  return (
    <main className="st-about">
      <section className="st-about-hero">
        <h1 className="st-about-title">
          {settings?.tagline ?? 'We make\nwork that\nmatters.'}
        </h1>
        <p className="st-about-bio">{bio}</p>
      </section>

      <section className="st-about-section">
        <p className="st-about-section-label">Studio</p>
        <div className="st-about-info-grid">
          <div className="st-about-info-item">
            <span className="st-about-info-key">Founded</span>
            <span className="st-about-info-val">2020</span>
          </div>
          <div className="st-about-info-item">
            <span className="st-about-info-key">Based</span>
            <span className="st-about-info-val">Milan, Italy</span>
          </div>
          <div className="st-about-info-item">
            <span className="st-about-info-key">Services</span>
            <span className="st-about-info-val">Film · Photography · Art Direction</span>
          </div>
          {settings?.email && (
            <div className="st-about-info-item">
              <span className="st-about-info-key">Contact</span>
              <span className="st-about-info-val">
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </span>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
