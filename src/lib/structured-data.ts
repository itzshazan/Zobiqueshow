import type { Product, WorkItem } from './types'
import { site } from './content'

const abs = (path: string) => new URL(path, site.url).toString()

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.brandName,
    url: site.url,
    logo: abs(site.logo),
    email: site.email,
    telephone: site.phone,
    founder: { '@type': 'Person', name: site.founder.name, jobTitle: site.founder.role },
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    sameAs: site.socials.map((s) => s.url),
    subOrganization: { '@type': 'Organization', name: site.labs.name, url: site.labs.url },
  }
}

// No ratings or offers: none are real yet (brief section J)
export function productLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.oneLiner,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: p.url,
    image: p.screenshots[0] ? abs(p.screenshots[0].src) : undefined,
    publisher: { '@type': 'Organization', name: site.legalName, url: site.url },
  }
}

export function articleLd(w: WorkItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: w.title,
    description: w.outcome,
    image: w.screenshots[0] ? abs(w.screenshots[0].src) : undefined,
    url: abs(`/case-studies/${w.slug}`),
    author: { '@type': 'Organization', name: site.legalName, url: site.url },
    publisher: { '@type': 'Organization', name: site.legalName, logo: { '@type': 'ImageObject', url: abs(site.logo) } },
  }
}
