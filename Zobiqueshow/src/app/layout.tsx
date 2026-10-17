import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Motion from '@/components/Motion'
import { JsonLd } from '@/components/blocks'
import { getProducts, pages, site } from '@/lib/content'
import { organizationLd } from '@/lib/structured-data'
import './globals.css'

// zobique.com's typeface: Geist for headings and body alike
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: pages.home.meta.title, template: `%s` },
  description: pages.home.meta.description,
  applicationName: site.brandName,
  icons: { icon: site.logo, apple: site.logo },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  openGraph: {
    type: 'website',
    siteName: site.brandName,
    title: pages.home.meta.title,
    description: pages.home.meta.description,
    url: site.url,
    images: [{ url: '/screens/ncs.jpg', width: 1440, height: 860, alt: 'Zobique Career AI deployed for National Career Service users' }],
  },
  twitter: { card: 'summary_large_image', site: '@zobiqueai' },
}

export const viewport: Viewport = {
  themeColor: '#f55036',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const navProducts = getProducts().map(({ slug, name, oneLiner, logo, mark, status }) => ({ slug, name, oneLiner, logo: mark ?? logo, status }))
  return (
    <html lang="en" className={geist.variable}>
      <body>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Header brandName={site.brandName} logo={site.logo} products={navProducts} />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationLd()} />
        <Motion />
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
      {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
    </html>
  )
}
