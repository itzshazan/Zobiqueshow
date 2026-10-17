import type { Metadata } from 'next'
import CaseScroller from '@/components/CaseScroller'
import SmartLink from '@/components/SmartLink'
import { CaseCard, PageHead } from '@/components/blocks'
import { ArrowRight } from '@/components/icons'
import { getWork, pages, site } from '@/lib/content'

const copy = pages.sections.work

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: '/case-studies' },
}

export default function WorkPage() {
  const work = getWork()
  const nav = work.map((w) => ({
    slug: w.slug,
    client: w.client,
    eyebrow: w.eyebrow ?? (w.owner === 'zobique' ? 'Zobique product' : 'Zobique Labs'),
    logo: w.logo ?? (w.owner === 'zobique' ? site.logo : null),
  }))
  return (
    <>
      <PageHead title={copy.heading} lede={copy.intro} />
      <section className="wrap" style={{ paddingBottom: 'clamp(32px, 4vw, 48px)' }}>
        {work.length > 0 ? (
          <CaseScroller items={nav}>{work.map((w) => <CaseCard key={w.slug} item={w} />)}</CaseScroller>
        ) : (
          <p className="muted">{copy.empty}</p>
        )}
      </section>


      <section className="pp2-handoff" aria-label="Start a project">
        <div className="wrap">
          <SmartLink href={site.labs.contactUrl} className="pp2-handoff-link" hideIcon event={{ name: 'labs_cta_click', location: 'work-foot' }}>
            <span className="pp2-handoff-k">Start a project</span>
            <span className="pp2-handoff-v">Talk to {site.labs.name}<ArrowRight className="pp2-handoff-arrow" /></span>
          </SmartLink>
        </div>
      </section>
    </>
  )
}
