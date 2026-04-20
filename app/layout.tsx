import type { Metadata } from 'next'
import './globals.css'
import SiteShell from '../components/SiteShell'
import FooterConditional from '../components/FooterConditional'

export const metadata: Metadata = {
  title: {
    template: '%s — Studio Talent',
    default: 'Studio Talent',
  },
  description: 'Progettiamo e realizziamo edifici come persone, dalle funzioni più antiche alla luce degli ambienti di oggi.',
  metadataBase: new URL('https://studiotalent.com'),
  openGraph: {
    siteName: 'Studio Talent',
    type: 'website',
    title: 'Studio Talent',
    description: 'Studio di architettura ed interior. Progettiamo e realizziamo edifici come persone, dalle funzioni più antiche alla luce degli ambienti di oggi.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Studio Talent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Talent',
    description: 'Studio di architettura ed interior. Progettiamo e realizziamo edifici come persone, dalle funzioni più antiche alla luce degli ambienti di oggi.',
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
