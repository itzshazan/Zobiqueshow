import type { Metadata } from 'next'
import SmartLink from '@/components/SmartLink'
import { ArrowLoop } from '@/components/icons'
import { founderPhoto, isVerified, pages, site } from '@/lib/content'

const about = pages.about

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  // The story names the NCS deployment; it shows only while that evidence is verified
  const story = isVerified(...about.storyEvidenceIds) ? about.story : about.story.slice(0, 1)
  const press = about.press.items.filter((p) => isVerified(p.evidenceId))

  const f = site.founder
  const photo = founderPhoto()
  return (
    <>
      <section className="ab-hero" aria-labelledby="ab-title">
        <div className="wrap">
          <h1 className="eyebrow ab-h1" id="ab-title">{about.heading}</h1>
          <p className="ab-statement">{story[0]}</p>
          {story.slice(1).map((para) => <p key={para} className="lede ab-lede">{para}</p>)}
        </div>
      </section>

      <div className="wrap ab-rows">
        <section className="ab-row" aria-labelledby="connection">
          <h2 id="connection" className="ab-label">{about.connection.heading}</h2>
          <div>
            <p className="ab-body">{about.connection.body}</p>
            <div className="ab-loop" aria-hidden="true">
              <span className="ab-node">Products</span>
              <span className="ab-arrows"><ArrowLoop /></span>
              <span className="ab-node ab-node-dark">{site.labs.name}</span>
            </div>
          </div>
        </section>

        <section className="ab-row" aria-labelledby="founder">
          <h2 id="founder" className="ab-label">{about.founder.heading}</h2>
          <div className="ab-founder">
            {photo ? <img src={photo} alt={`${f.name}, ${f.role}`} width={160} height={160} /> : <span className="founder-avatar ab-founder-ph" aria-hidden="true" />}
            <div>
              <p className="ab-founder-name">{f.name}</p>
              <p className="muted">{f.role}, {site.legalName}</p>
              {f.story && <p className="ab-body">{f.story}</p>}
              {(press[0] || f.linkedin) && (
                <p className="founder-links">
                  {press[0] && <SmartLink href={press[0].href} className="pp2-link">{press[0].outlet} feature</SmartLink>}
                  {f.linkedin && <SmartLink href={f.linkedin} className="pp2-link">LinkedIn</SmartLink>}
                </p>
              )}
            </div>
          </div>
        </section>

        {press.length > 0 && (
          <section className="ab-row" aria-labelledby="press">
            <h2 id="press" className="ab-label">{about.press.heading}</h2>
            <div>
              {press.map((p) => (
                <p key={p.href} className="press-item">
                  <span className="press-outlet">{p.outlet}</span>
                  <SmartLink href={p.href} className="text-link">{p.title}</SmartLink>
                  <span className="muted">{p.date}</span>
                </p>
              ))}
            </div>
          </section>
        )}

        <section className="ab-row" aria-labelledby="entity">
          <h2 id="entity" className="ab-label">{about.entity.heading}</h2>
          <dl className="pp2-facts ab-facts">
            <div><dt>Company</dt><dd>{site.legalName}</dd></div>
            <div><dt>Address</dt><dd>{site.address.display}</dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${site.email}`} className="pp2-link">{site.email}</a></dd></div>
            <div><dt>Phone</dt><dd><a href={site.phoneHref} className="pp2-link">{site.phone}</a></dd></div>
          </dl>
        </section>
      </div>
    </>
  )
}
