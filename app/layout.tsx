import type { Metadata } from 'next'
import { Inter_Tight } from 'next/font/google'
import './globals.css'
import SiteShell from '../components/SiteShell'
import FooterConditional from '../components/FooterConditional'

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — Studio Talent',
    default: 'Studio Talent — Architettura e Interior Design',
  },
  description: 'Studio Talent ricerca l\'equilibrio tra identità e forma, tra ciò che è e ciò che può diventare.',
  metadataBase: new URL('https://www.studiotalent.it'),
  openGraph: {
    siteName: 'Studio Talent',
    type: 'website',
    title: 'Studio Talent — Architettura e Interior Design',
    description: 'Studio Talent ricerca l\'equilibrio tra identità e forma, tra ciò che è e ciò che può diventare.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Studio Talent — Architettura e Interior Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Talent — Architettura e Interior Design',
    description: 'Studio Talent ricerca l\'equilibrio tra identità e forma, tra ciò che è e ciò che può diventare.',
    images: ['/twitter-card.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Studio Talent',
  url: 'https://www.studiotalent.it',
  description: 'Studio Talent ricerca l\'equilibrio tra identità e forma, tra ciò che è e ciò che può diventare.',
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
        <FooterConditional />
      </body>
    </html>
  )
}
