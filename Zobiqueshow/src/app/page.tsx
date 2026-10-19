import Reveal from '@/components/Reveal'
import SmartLink from '@/components/SmartLink'
import FeatureTabs, { type FeatureTab } from '@/components/FeatureTabs'
import WorkflowDeck from '@/components/WorkflowDeck'
import { CaseCard, CtaBand, ProductCard, Screenshot, SectionTitle, StatusChip } from '@/components/blocks'
import { ArrowLoop, ArrowRight, Boxes, CheckCircle, Chevron, SocialIcon, Wrench } from '@/components/icons'
import { getClients, getProducts, getWork, isVerified, pages } from '@/lib/content'

// Homepage: the eight sections of brief section F, in order.
export default function HomePage() {
  const home = pages.home
  const products = getProducts()
  const clients = getClients().filter((c) => c.logo)
  const work = getWork().slice(0, 1)
  const featured = home.featured.items.filter((f) => isVerified(f.evidenceId))
  const subline = isVerified(...home.hero.sublineEvidenceIds) ? home.hero.subline : home.hero.sublineFallback

  return (
    <>
      {/* 1. Hero — What is Zobique? Centred headline, real product screens below */}
      {/* Layout copied from wise.com's hero: full-bleed colour band, huge centred uppercase
          headline, subline, one pill button, wide rounded image. Text and image are Zobique's. */}
      <section className="wz-hero" aria-labelledby="hero-heading">
        <div className="wz-hero-inner">
          <h1 id="hero-heading" className="wz-title">
            {/* Each line sits in a mask so GSAP can slide it up into view */}
            <span className="wz-line"><span>{home.hero.headline.replace('real work.', '').trim()}</span></span>{' '}
            <span className="wz-line wz-accent"><span>real work.</span></span>
          </h1>
          <p className="wz-sub">{subline}</p>
          <SmartLink href={home.hero.primaryCta.href} className="wz-btn" event={{ name: 'cta_click', label: home.hero.primaryCta.label, destination: home.hero.primaryCta.href }}>
            {home.hero.primaryCta.label}
          </SmartLink>
        </div>
        <div className="wz-media">
          <picture>
            <source media="(max-width: 640px)" srcSet="/screens/zobique_hero_small.png" />
            <img src="/screens/zobique_hero_large.png" alt="Zobique product screens showing AI agents at work" width={1942} height={809} fetchPriority="high" />
          </picture>
        </div>
      </section>

      {/* Trusted partners: client logos from zobique.com and labs.zobique.com (consented only) */}
      {clients.length > 0 && (
        <section className="section partners" aria-labelledby="partners-heading">
          <div className="wrap">
            <SectionTitle id="partners-heading">{home.partners.heading}</SectionTitle>
            {/* Infinite loop: the list renders twice and slides by exactly -50%, so it wraps seamlessly */}
            <div className="partners-loop">
              <div className="partners-track-wrap">
              <div className="partners-track">
                {[0, 1].map((copy) => (
                  <ul key={copy} className="partners-set" aria-hidden={copy === 1 || undefined}>
                    {clients.map((c) => (
                      <li key={c.name}>
                        <img src={c.logo!} alt={copy === 0 ? c.name : ''} loading="lazy" style={c.scale ? { height: `${28 * c.scale}px` } : undefined} />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Two engines — How is the company organised? (zobique.com icon-tile cards) */}
      <section className="section section-alt" aria-labelledby="engines-heading">
        <div className="wrap">
          <Reveal>
            <SectionTitle id="engines-heading">{home.engines.heading}</SectionTitle>
            <div className="eng2">
              <SmartLink href={home.engines.products.link.href} className="eng2-tile eng2-light" hideIcon>
                <span className="eng2-eyebrow"><Boxes className="eng2-eyebrow-icon" />{home.engines.products.title}</span>
                <h3>{home.engines.products.body}</h3>
                <span className="eng2-link">{home.engines.products.link.label}<Chevron className="btn-chevron" /></span>
                <span className="eng2-shots" aria-hidden="true">
                  {products.slice(0, 2).map((p, i) => (
                    <span key={p.slug} className={`eng2-shot eng2-shot-${i}`}>
                      <span className="eng2-shot-bar"><img src={p.logo} alt="" width={20} height={20} />{p.name}<StatusChip status={p.status} /></span>
                      {p.screenshots[0] && <img src={p.screenshots[0].src} alt="" width={p.screenshots[0].width} height={p.screenshots[0].height} loading="lazy" />}
                    </span>
                  ))}
                </span>
              </SmartLink>

              <span className="eng2-loop" aria-hidden="true"><ArrowLoop /></span>

              <SmartLink href={home.engines.labs.link.href} className="eng2-tile eng2-dark" hideIcon>
                <span className="eng2-eyebrow"><Wrench className="eng2-eyebrow-icon" />{home.engines.labs.title}</span>
                <h3>{home.engines.labs.body}</h3>
                <span className="eng2-link">{home.engines.labs.link.label}<Chevron className="btn-chevron" /></span>
                <span className="eng2-systems">
                  {pages.labs.examples.items.map((e) => (
                    <span key={e.title} className="eng2-system"><CheckCircle className="eng2-check" />{e.title}</span>
                  ))}
                </span>
              </SmartLink>
            </div>
            <p className="eng2-caption"><span aria-hidden="true">↻</span> {home.engines.connector}</p>
          </Reveal>
        </div>
      </section>

      {/* 4. Product portfolio — What do you make? */}
      <section className="section" id="products" aria-labelledby="products-heading">
        <div className="wrap">
          <Reveal>
            <SectionTitle id="products-heading">{home.products.heading}</SectionTitle>
            <div className="product-grid">
              {products.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured: press, founder features and the live NCS deployment. Each card shows only
          once its evidence record is verified (content/evidence.json). */}
      {featured.length > 0 && (
        <section className="section section-alt" aria-labelledby="feat-heading">
          <div className="wrap">
            <SectionTitle id="feat-heading">{home.featured.heading}</SectionTitle>
            <ul className="feat-grid">
              {featured.map((f) => (
                <li key={f.href}>
                  <SmartLink href={f.href} className="feat-card" hideIcon event={{ name: 'cta_click', label: `Featured: ${f.outlet}`, destination: f.href }}>
                    <span className="feat-mark">
                      {'logo' in f && f.logo ? (
                        <img src={f.logo} alt={f.outlet} width={220} height={80} loading="lazy" />
                      ) : (
                        <span className="feat-outlet">
                          {'handle' in f && f.handle && <SocialIcon label="Instagram" className="feat-ig" />}
                          <strong>{f.outlet}</strong>
                          {'handle' in f && f.handle && <em>{f.handle}</em>}
                        </span>
                      )}
                    </span>
                    <span className="feat-body">
                      <span className="feat-kind">{f.kind}{'date' in f && f.date ? <> · {f.date}</> : null}</span>
                      <span className="feat-title">{f.title}</span>
                      <span className="feat-cta">{f.cta}<ArrowRight className="feat-arrow" /></span>
                    </span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 5. Zobique Labs — Can you build something for us?
          Layout of zobique.com's "Our Features"; content from labs.zobique.com's phases */}
      <section className="section ft-section" aria-labelledby="labs-heading">
        <div className="wrap">
          <Reveal>
            <div className="ft-head">
              <h2 id="labs-heading">{home.labs.heading}</h2>
              <p>{home.labs.body}</p>
            </div>
            <FeatureTabs tabs={home.labs.features.tabs as FeatureTab[]} keyBenefitsLabel={home.labs.features.keyBenefitsLabel} idPrefix="labs" />
            <div className="ft-cta">
              <SmartLink href={home.labs.cta.href} className="btn-round" event={{ name: 'labs_cta_click', location: 'home-labs' }}>
                {home.labs.cta.label}
              </SmartLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Selected work — Show me. Max three at launch (Labs featured cards) */}
      {work.length > 0 && (
        <section className="section" aria-labelledby="work-heading">
          <div className="wrap">
            <Reveal>
              <SectionTitle id="work-heading" action={<SmartLink href={home.work.cta.href} className="text-link">{home.work.cta.label}</SmartLink>}>
                {home.work.heading}
              </SectionTitle>
              <div className="case-grid">
                {work.map((w) => <CaseCard key={w.slug} item={w} />)}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 7. How we build — Why trust your engineering?
          Layout and phase text from labs.zobique.com "From Workflow to Production" */}
      <section className="section section-alt" aria-labelledby="workflow-heading">
        <div className="wrap">
          <Reveal>
            <SectionTitle id="workflow-heading">{home.workflow.heading}</SectionTitle>
            <p className="wf-intro">{home.workflow.intro}</p>
            <WorkflowDeck phases={home.workflow.phases} />
          </Reveal>
        </div>
      </section>

      {/* 8. Closing CTA — What do I do next? (zobique.com CTA band). The founder lives on /about. */}
      <section className="section" aria-label="What to do next">
        <div className="wrap">
          <Reveal>
            <CtaBand id="closing-heading" heading={home.closing.heading} intro={home.engines.connector} options={home.closing.options} location="home-closing" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
