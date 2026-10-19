import type { MetadataRoute } from 'next'
import { getLocalWork, getProducts, site } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/products',
    ...getProducts().map((p) => `/products/${p.slug}`),
    '/labs',
    '/case-studies',
    ...getLocalWork().map((w) => `/case-studies/${w.slug}`),
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    ...(site.features.insights ? ['/insights'] : []),
  ]
  return paths.map((p) => ({ url: new URL(p, site.url).toString() }))
}
