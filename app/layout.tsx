import type { Metadata } from 'next'
import './globals.css'
import SiteShell from '../components/SiteShell'
import FooterConditional from '../components/FooterConditional'

export const metadata: Metadata = {
  title: {
    template: '%s — Studio Talent',
    default: 'Studio Talent',
  },
  description: 'Studio Talent — Creative Agency',
  metadataBase: new URL('https://studiotalent.com'),
  openGraph: {
    siteName: 'Studio Talent',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
        <FooterConditional />
      </body>
    </html>
  )
}
