import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SmartLink from '@/components/SmartLink'
import { JsonLd, SectionTitle, StatusChip } from '@/components/blocks'
import { ArrowRight } from '@/components/icons'
import { getProduct, getProducts, isVerified, site, visibleProof } from '@/lib/content'
import { productLd } from '@/lib/structured-data'

export const dynamicParams = false

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug)
  if (!p) return {}
  return {
    title: `${p.name} — ${p.category}`,
    description: p.oneLiner,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { images: p.screenshots[0] ? [{ url: p.screenshots[0].src, alt: p.screenshots[0].alt }] : undefined },
  }
}

// Short summary only; the full story lives on the product's own site (brief section G).
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug)
  if (!p) notFound()
  const showCapabilities = isVerified(p.capabilitiesEvidenceId)
  const proof = visibleProof(p)
  const shot = p.screenshots[0]
  const domain = new URL(p.url).hostname

  return (
    <>
      {/* Header: identity and CTA beside the real product screen */}
      <section className="pp-hero" aria-labelledby="pp-title">
        <div className="wrap pp-hero-grid">
          <div>
            <Link href="/products" className="pp-back">← All products</Link>
            <div className="pp-id">
              <img src={p.logo} alt="" width={96} height={40} />
              <StatusChip status={p.status} />
            </div>
            <p className="eyebrow">{p.category}</p>
            <h1 id="pp-title">{p.name}</h1>
            <p className="lede">{p.oneLiner}</p>
            <div className="hero-ctas">
              <SmartLink href={p.url} className="btn btn-primary" event={{ name: 'product_card_click', product: p.slug }}>
                {p.ctaLabel}
              </SmartLink>
              <span className="pp-domain">{domain} · by {site.brandName}</span>
            </div>
          </div>
          {shot && (
            <SmartLink href={p.url} className="hero2-win pp-shot" hideIcon>
              <span className="hero2-bar">
                <span className="device-dots-inline" aria-hidden="true"><i /><i /><i /></span>
                <span className="hero2-name">{domain}</span>
              </span>
              <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} fetchPriority="high" />
            </SmartLink>
          )}
        </div>
      </section>

      {/* Overview: the problem as a statement, who it's for and the proof beside it */}
      <section className="section pp2-overview" aria-labelledby="pp-problem">
        <div className="wrap pp2-grid">
          <div>
            <p className="pp2-label" id="pp-problem">The problem</p>
            <p className="pp2-statement">{p.problem}</p>
          </div>
          <dl className="pp2-facts">
            <div><dt>Built for</dt><dd>{p.audience}</dd></div>
            {proof.map((pr) => (
              <div key={pr.evidenceId}>
                <dt>Proof</dt>
                <dd>
                  <span className="pp2-live" aria-hidden="true" />
                  {pr.href ? <SmartLink href={pr.href} className="pp2-link">{pr.text}</SmartLink> : pr.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Capabilities: tinted band, checked rows */}
      {showCapabilities && (
        <section className="section pp4-section" aria-labelledby="pp-caps">
          <div className="wrap">
            <SectionTitle id="pp-caps">What it does</SectionTitle>
            <ul className="pp4-caps">
              {(p.capabilityDetails ?? p.capabilities.map((c) => ({ title: c, detail: '' }))).map((c) => (
                <li key={c.title}>
                  <h3>{c.title}</h3>
                  {c.detail && <p>{c.detail}</p>}
                </li>
              ))}
            </ul>
            {p.labsNote && (
              <div className="pp3-note">
                <p>{p.labsNote}</p>
                <SmartLink href="/labs" className="btn btn-secondary" event={{ name: 'labs_cta_click', location: `product-${p.slug}` }}>
                  About {site.labs.name}
                </SmartLink>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Close: hand off to the product's own site */}
      <section className="pp2-handoff" aria-label={`Continue to ${domain}`}>
        <div className="wrap">
          <SmartLink href={p.url} className="pp2-handoff-link" hideIcon event={{ name: 'product_card_click', product: p.slug }}>
            <span className="pp2-handoff-k">{p.ctaLabel}</span>
            <span className="pp2-handoff-v">Continue on {domain}<ArrowRight className="pp2-handoff-arrow" /></span>
          </SmartLink>
        </div>
      </section>
      <JsonLd data={productLd(p)} />
    </>
  )
}
