// Presentational blocks (brief section I), styled after zobique.com and labs.zobique.com.
import type { ReactNode } from 'react'
import type { Product, ProductStatus, Screenshot as Shot, Testimonial, WorkItem } from '@/lib/types'
import { founderPhoto, isVerified, site, visibleProof, workHref } from '@/lib/content'
import SmartLink from './SmartLink'
import ExternalIcon from './ExternalIcon'
import { ArrowRight, CheckCircle, Chevron, Person } from './icons'

const STATUS_LABEL: Record<ProductStatus, string> = {
  live: 'Live',
  'early-access': 'Early access',
  beta: 'Beta',
  'in-development': 'In development',
}

export function StatusChip({ status }: { status: ProductStatus }) {
  return <span className={`chip chip-${status}`}>{STATUS_LABEL[status]}</span>
}

/** Orange check-circle list (zobique.com "Key Benefits", Labs phase lists) */
export function CheckList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`checklist ${className}`.trim()}>
      {items.map((i) => (
        <li key={i}><CheckCircle className="check-icon" />{i}</li>
      ))}
    </ul>
  )
}

/**
 * Real screenshot in a frame. "light" is a plain rounded frame; "device" is the dark
 * window with traffic-light dots used on labs.zobique.com.
 */
export function Screenshot({ shot, priority = false, caption = true, frame = 'light', className = '' }: {
  shot: Shot
  priority?: boolean
  caption?: boolean
  frame?: 'light' | 'device'
  className?: string
}) {
  return (
    <figure className={`shot ${className}`.trim()}>
      <div className={frame === 'device' ? 'shot-frame shot-device' : 'shot-frame'}>
        {frame === 'device' && <span className="device-dots" aria-hidden="true"><i /><i /><i /></span>}
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
        />
      </div>
      {caption && shot.caption && <figcaption>{shot.caption}</figcaption>}
    </figure>
  )
}

export function PageHead({ title, lede, eyebrow, children }: { title: string; lede?: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </div>
  )
}

/** Section title with zobique.com's short orange bar underneath */
export function SectionTitle({ id, children, action }: { id: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-head">
      <h2 id={id} className="title-bar">{children}</h2>
      {action}
    </div>
  )
}

export function ProductCard({ product, headingLevel = 3 }: { product: Product; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3'
  const shot = product.screenshots[0]
  const showCapabilities = isVerified(product.capabilitiesEvidenceId)
  return (
    <article className="product-card">
      {shot && <Screenshot shot={shot} caption={false} />}
      <div className="product-body">
        <div className="product-top">
          <div className="product-id">
            <img src={product.logo} alt="" width={64} height={32} />
            <H>{product.name}</H>
          </div>
          <StatusChip status={product.status} />
        </div>
        <p className="product-category">{product.category}</p>
        <p>{product.oneLiner}</p>
        {showCapabilities && <CheckList items={product.capabilities.slice(0, 3)} />}
        <div className="product-actions">
          <SmartLink href={product.url} className="btn btn-primary" event={{ name: 'product_card_click', product: product.slug }}>
            {product.ctaLabel}
          </SmartLink>
          <SmartLink href={`/products/${product.slug}`} className="text-link">
            About {product.name.replace(/^Zobique /, '')}
          </SmartLink>
          <span className="product-endorse">by {site.brandName}</span>
        </div>
      </div>
    </article>
  )
}

export function ProofList({ product }: { product: Product }) {
  const proof = visibleProof(product)
  if (!proof.length) return null
  return (
    <ul className="proof-items">
      {proof.map((p) => (
        <li key={p.evidenceId}>{p.href ? <SmartLink href={p.href} className="text-link">{p.text}</SmartLink> : p.text}</li>
      ))}
    </ul>
  )
}

/**
 * Featured case card: text panel (logo tile, category, OUTCOME + title, the brief's four
 * lines as label/value rows, case-study link and live domain) beside a screenshot panel.
 */
export function CaseCard({ item }: { item: WorkItem }) {
  const href = workHref(item)
  const shot = item.screenshots[0]
  const logo = item.logo ?? (item.owner === 'zobique' ? site.logo : null)
  const domain = item.liveUrl ? new URL(item.liveUrl).hostname.replace(/^www\./, '') : null
  const c = item.card ?? item
  const rows: [string, ReactNode][] = [
    ['Client', item.client],
    ['Problem', c.problem],
    ['What we built', c.built],
    ['Result', <>{c.result}<span className="cf-def">{c.resultDefinition}</span></>],
  ]
  return (
    <article className={`case-feature${shot ? ' has-media' : ''}`}>
      <div className="cf-text">
        <div className="cf-intro">
        <p className="cf-category">
          {logo && <img className="cf-logo" src={logo} alt="" width={28} height={28} />}
          {item.eyebrow ?? (item.owner === 'zobique' ? 'Zobique product' : 'Zobique Labs')}
        </p>
        <p className="cf-outcome-label">Outcome</p>
        <h3 className="cf-title">{item.title}</h3>
        <div className="cf-foot">
          <SmartLink href={href} className="cf-read" hideIcon>
            {item.canonicalUrl ? 'Read on Zobique Labs' : 'Read the case study'}<ArrowRight className="cf-arrow" />
          </SmartLink>
          {domain && item.liveUrl && (
            <SmartLink href={item.liveUrl} className="cf-domain">{domain}</SmartLink>
          )}
        </div>
        </div>
        <dl className="cf-rows">
          {rows.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </div>
      {shot && (
        <div className="cf-media">
          <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
        </div>
      )}
    </article>
  )
}

/** Labs "From Workflow to Production" phase cards: black header bar, phase n of N */
export function PhaseCards({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="phases">
      {steps.map((s, i) => (
        <li key={s.title} className="phase">
          <div className="phase-bar">
            <span className="phase-name">{s.title}</span>
            <span className="phase-count">Phase {i + 1} of {steps.length}</span>
          </div>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  )
}

/** Labs "Systems We Build" card: title, line, footer link */
export function SystemCard({ title, body, link }: { title: string; body: string; link: { label: string; href: string } }) {
  return (
    <article className="system-card">
      <div className="system-body">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <SmartLink href={link.href} className="system-foot" hideIcon event={{ name: 'labs_cta_click', location: `system-${title}` }}>
        <span>{link.label}</span>
        <Chevron className="btn-chevron" />
      </SmartLink>
    </article>
  )
}

export function FounderStrip({ pressHref }: { pressHref?: string }) {
  const f = site.founder
  const photo = founderPhoto()
  return (
    <div className="founder">
      {photo ? (
        <img src={photo} alt={`${f.name}, ${f.role}`} width={72} height={72} />
      ) : (
        <span className="founder-avatar" aria-hidden="true"><Person /></span>
      )}
      <div>
        <p className="founder-name">{f.name}</p>
        <p className="muted">{f.role}</p>
        {f.story && <p>{f.story}</p>}
        {(pressHref || f.linkedin) && (
          <p className="founder-links">
            {pressHref && <SmartLink href={pressHref} className="text-link">India Today feature</SmartLink>}
            {f.linkedin && <SmartLink href={f.linkedin} className="text-link">LinkedIn</SmartLink>}
          </p>
        )}
      </div>
    </div>
  )
}

export function RoutingPanel({ options, location }: { options: { label: string; body: string; href: string }[]; location: string }) {
  return (
    <div className="routes">
      {options.map((o) => (
        <SmartLink
          key={o.label}
          href={o.href}
          className="route"
          hideIcon
          event={o.href.includes('labs.zobique.com') ? { name: 'labs_cta_click', location } : { name: 'cta_click', label: o.label, destination: o.href }}
        >
          <strong>{o.label}{/^https?:\/\//.test(o.href) && <ExternalIcon />}</strong>
          <span>{o.body}</span>
        </SmartLink>
      ))}
    </div>
  )
}

/** zobique.com "Ready to Transform Your Career Journey?" card: orange gradient, soft circles,
 *  centred heading, intro, check lines, then a solid white button and outline buttons. */
export function CtaBand({ id, heading, intro, options, location }: { id: string; heading: string; intro?: string; options: { label: string; body: string; href: string }[]; location: string }) {
  return (
    <div className="cta-band" aria-labelledby={id}>
      <span className="cta-orb cta-orb-a" aria-hidden="true" />
      <span className="cta-orb cta-orb-b" aria-hidden="true" />
      <div className="cta-inner">
        <h2 id={id}>{heading}</h2>
        {intro && <p className="cta-intro">{intro}</p>}
        <ul className="cta-checks">
          {options.map((o) => (
            <li key={o.label}><CheckCircle className="cta-check" />{o.body}</li>
          ))}
        </ul>
        <div className="cta-buttons">
          {options.map((o, i) => (
            <SmartLink
              key={o.label}
              href={o.href}
              className={i === 0 ? 'cta-btn cta-btn-solid' : 'cta-btn cta-btn-ghost'}
              event={o.href.includes('labs.zobique.com') ? { name: 'labs_cta_click', location } : { name: 'cta_click', label: o.label, destination: o.href }}
            >
              {o.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Labs testimonial card. Callers pass only consented testimonials. */
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="testimonial-card">
      <blockquote>“{t.quote}”</blockquote>
      <figcaption>
        <span className="founder-avatar small" aria-hidden="true"><Person /></span>
        <span><strong>{t.name}</strong><span className="muted">{t.role}, {t.company}</span></span>
      </figcaption>
    </figure>
  )
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify output is safe inside <script> once "<" is escaped
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
