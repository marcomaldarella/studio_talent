import type { Metadata } from 'next'
import './globals.css'
import SiteShell from '../components/SiteShell'
import FooterConditional from '../components/FooterConditional'

export const metadata: Metadata = {
  title: {
    template: '%s — Onira',
    default: 'Onira — Independent Film Production',
  },
  description: 'Onira is an independent film production studio supporting bold, thought-provoking artistic voices that pierce at the heart of the human experience.',
  metadataBase: new URL('https://onira.one'),
  openGraph: {
    siteName: 'Onira',
    type: 'website',
    title: 'Onira — Independent Film Production',
    description: 'Onira is an independent film production studio supporting bold, thought-provoking artistic voices that pierce at the heart of the human experience.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Onira — Independent Film Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onira — Independent Film Production',
    description: 'Onira is an independent film production studio supporting bold, thought-provoking artistic voices that pierce at the heart of the human experience.',
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
  name: 'Onira',
  url: 'https://onira.one',
  logo: 'https://onira.one/logo.svg',
  description: 'Onira is an independent film production studio supporting bold, thought-provoking artistic voices that pierce at the heart of the human experience.',
  founders: [
    { '@type': 'Person', name: 'Filippo Schiaffino' },
    { '@type': 'Person', name: 'Rodolfo L. Masedari' },
  ],
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
