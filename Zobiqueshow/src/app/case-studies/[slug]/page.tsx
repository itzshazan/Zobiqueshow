import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SmartLink from '@/components/SmartLink'
import TrackView from '@/components/TrackView'
import { ArrowRight } from '@/components/icons'
import { JsonLd, PageHead, Screenshot, TestimonialCard } from '@/components/blocks'
import { getLocalWork, getTestimonials, getWorkItem } from '@/lib/content'
import { articleLd } from '@/lib/structured-data'

export const dynamicParams = false

// Only product work has a page here; Labs case studies stay canonical on labs.zobique.com
export function generateStaticParams() {
  return getLocalWork().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = getWorkItem((await params).slug)
  if (!w) return {}
  return {
    title: `${w.title} — Zobique`,
    description: w.outcome,
    alternates: { canonical: `/case-studies/${w.slug}` },
    openGraph: { type: 'article', images: w.screenshots[0] ? [{ url: w.screenshots[0].src, alt: w.screenshots[0].alt }] : undefined },
  }
}

// Template from brief section H: title and outcome, context, problem, what we built,
// result with its definition, screenshots and live link, testimonial (consent only), CTA.
export default async function WorkItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const w = getWorkItem((await params).slug)
  if (!w) notFound()
  const testimonial = getTestimonials().find((t) => t.workSlug === w.slug)

  return (
    <>
      <TrackView event={{ name: 'case_study_view', slug: w.slug }} />
      <PageHead eyebrow={w.eyebrow} title={w.title} lede={w.outcome} />

      <article className="wrap case-page" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        {w.context && (
          <section className="case-block" aria-labelledby="ctx">
            <h2 id="ctx">Context</h2>
            <p>{w.context}</p>
          </section>
        )}

        <section className="case-block" aria-labelledby="problem">
          <h2 id="problem">Problem</h2>
          <p>{w.problem}</p>
        </section>

        <section className="case-block" aria-labelledby="built">
          <h2 id="built">What we built</h2>
          <div>
            <p>{w.built}</p>
            {w.components.length > 0 && (
              <ul className="components">
                {w.components.map((c) => (
                  <li key={c.name}><h3 style={{ fontSize: 18 }}>{c.name}</h3><p>{c.detail}</p></li>
                ))}
              </ul>
            )}
            {w.flow.length > 0 && (
              <ol className="flow" aria-label="How it flows">
                {w.flow.flatMap((step, i) => [
                  <li key={step}>{step}</li>,
                  i < w.flow.length - 1 ? <li key={`${step}-arrow`} className="flow-arrow" aria-hidden="true">→</li> : null,
                ])}
              </ol>
            )}
          </div>
        </section>

        <section className="case-block" aria-labelledby="result">
          <h2 id="result">Result</h2>
          <div>
            <p>{w.result}</p>
            <p className="case-def">{w.resultDefinition}</p>
          </div>
        </section>

        {w.screenshots.length > 0 && (
          <section className="case-block" aria-labelledby="see">
            <h2 id="see">See it</h2>
            <div className="see-grid">
              {w.screenshots.map((s) => <Screenshot key={s.src} shot={s} frame="device" />)}
            </div>
          </section>
        )}

        {testimonial && (
          <section className="case-block" aria-labelledby="said">
            <h2 id="said">What they said</h2>
            <TestimonialCard t={testimonial} />
          </section>
        )}

      </article>

      {/* Close: the live deployment and the product behind it */}
      {(w.liveUrl || w.cta) && (
        <section className="pp2-handoff" aria-label="Next">
          <div className="wrap case-handoff">
            {w.liveUrl && (
              <SmartLink href={w.liveUrl} className="pp2-handoff-link" hideIcon>
                <span className="pp2-handoff-k">See it live</span>
                <span className="pp2-handoff-v">{w.liveUrl.replace(/^https:\/\//, '')}<ArrowRight className="pp2-handoff-arrow" /></span>
              </SmartLink>
            )}
            {w.cta && (
              <SmartLink href={w.cta.href} className="pp2-handoff-link" hideIcon event={{ name: 'cta_click', label: w.cta.label, destination: w.cta.href }}>
                <span className="pp2-handoff-k">{w.owner === 'labs' ? 'Start a project' : 'The product'}</span>
                <span className="pp2-handoff-v">{w.cta.label}<ArrowRight className="pp2-handoff-arrow" /></span>
              </SmartLink>
            )}
          </div>
        </section>
      )}
      <JsonLd data={articleLd(w)} />
    </>
  )
}
