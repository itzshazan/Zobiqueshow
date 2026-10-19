import type { Metadata } from 'next'
import Reveal from '@/components/Reveal'
import SmartLink from '@/components/SmartLink'
import FeatureTabs, { type FeatureTab } from '@/components/FeatureTabs'
import WorkflowDeck from '@/components/WorkflowDeck'
import { CaseCard, CtaBand, SectionTitle } from '@/components/blocks'
import { getWork, pages, site } from '@/lib/content'

const labs = pages.labs
const home = pages.home

export const metadata: Metadata = {
  title: labs.meta.title,
  description: labs.meta.description,
  alternates: { canonical: '/labs' },
}

// What Labs does, the systems it builds, how a project runs, selected work, CTA.
// No full service catalogue: that lives on labs.zobique.com (brief section K.7).
export default function LabsPage() {
  const work = getWork().filter((w) => w.owner === 'labs')
  const shot = labs.screenshot

  return (
    <>
      <section className="pp-hero" aria-labelledby="labs-title">
        <div className="wrap pp-hero-grid">
          <div>
            <p className="eyebrow">{labs.eyebrow}</p>
            <h1 id="labs-title">{labs.heading}</h1>
            <p className="lede">{labs.intro}</p>
            <div className="hero-ctas">
              <SmartLink href={labs.cta.href} className="btn btn-primary" event={{ name: 'labs_cta_click', location: 'labs-head' }}>
                {labs.cta.label}
              </SmartLink>
              <SmartLink href={site.labs.url} className="btn btn-secondary">Visit labs.zobique.com</SmartLink>
            </div>
          </div>
          <SmartLink href={site.labs.url} className="hero2-win pp-shot" hideIcon>
            <span className="hero2-bar">
              <span className="device-dots-inline" aria-hidden="true"><i /><i /><i /></span>
              <span className="hero2-name">labs.zobique.com</span>
            </span>
            <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} fetchPriority="high" />
          </SmartLink>
        </div>
      </section>

      <section className="section section-alt ft-section" aria-labelledby="labs-systems">
        <div className="wrap">
          <Reveal>
            <SectionTitle id="labs-systems">{labs.examples.heading}</SectionTitle>
            <FeatureTabs tabs={home.labs.features.tabs as FeatureTab[]} keyBenefitsLabel={home.labs.features.keyBenefitsLabel} idPrefix="labs-page" />
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="labs-process">
        <div className="wrap">
          <SectionTitle id="labs-process">{labs.process.heading}</SectionTitle>
          <p className="wf-intro">{home.workflow.intro}</p>
          <WorkflowDeck phases={home.workflow.phases} />
        </div>
      </section>

      {work.length > 0 && (
        <section className="section section-alt" aria-labelledby="labs-work-heading">
          <div className="wrap">
            <SectionTitle id="labs-work-heading">{labs.work.heading}</SectionTitle>
            <div className="case-grid">{work.map((w) => <CaseCard key={w.slug} item={w} />)}</div>
          </div>
        </section>
      )}

      <section className="section" aria-label="Talk to Zobique Labs">
        <div className="wrap">
          <CtaBand
            id="labs-cta-heading"
            heading={labs.cta.heading}
            intro={home.labs.body}
            options={[{ label: labs.cta.label, body: labs.process.steps.map((st) => st.title).join(' → '), href: labs.cta.href }]}
            location="labs-foot"
          />
        </div>
      </section>
    </>
  )
}
