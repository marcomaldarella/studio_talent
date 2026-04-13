import type { Metadata } from 'next'
import { client } from '../../lib/sanityClient'
import { SITE_SETTINGS_QUERY } from '../../lib/queries'
import type { SiteSettings } from '../../types'
import Footer from '../../components/Footer'
import '../../styles/contact.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
}

export default async function ContactPage() {
  const settings: SiteSettings | null = await client
    .fetch(SITE_SETTINGS_QUERY)
    .catch(() => null)

  const email = settings?.email ?? 'hello@studiotalent.com'
  const instagram = settings?.instagram ?? 'studiotalent'

  return (
    <main className="st-contact">
      <section className="st-contact-hero">
        <h1 className="st-contact-title">Get in<br />touch.</h1>
        <p className="st-contact-intro">
          For project inquiries, collaborations, and general questions —
          reach out via email or follow us on Instagram.
        </p>
      </section>

      <div className="st-contact-links">
        <a href={`mailto:${email}`} className="st-contact-link-row">
          <span className="st-contact-link-label">Email</span>
          <span className="st-contact-link-value">{email}</span>
        </a>
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="st-contact-link-row"
        >
          <span className="st-contact-link-label">Instagram</span>
          <span className="st-contact-link-value">@{instagram.replace('@', '')}</span>
        </a>
      </div>

      <Footer />
    </main>
  )
}
