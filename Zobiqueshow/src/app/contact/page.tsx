import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import ExternalIcon from '@/components/ExternalIcon'
import SmartLink from '@/components/SmartLink'
import { ArrowRight } from '@/components/icons'
import { pages, site } from '@/lib/content'

const contact = pages.contact

export const metadata: Metadata = {
  title: contact.meta.title,
  description: contact.meta.description,
  alternates: { canonical: '/contact' },
}

// Orange band in the home hero's style (big heading, direct email as the main way in),
// numbered where-to-go list, then a plain two-column form with no card around it.
export default function ContactPage() {
  const formNote = contact.routes[contact.routes.length - 1].body.replace(' Use the form below.', '')
  return (
    <>
      <section className="cx-band" aria-labelledby="contact-heading">
        <div className="wrap cx-band-grid">
          <div className="cx-head">
            <h1 id="contact-heading">{contact.heading}</h1>
            <p>{contact.intro}</p>
          </div>
          <div className="cx-direct">
            <a className="cx-email" href={`mailto:${site.email}`}>{site.email}</a>
            <a className="cx-phone" href={site.phoneHref}>{site.phone}</a>
            <p className="cx-address">{site.address.display}</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        <ol className="cx-routes" aria-label="Where to go">
          {contact.routes.map((r, i) => (
            <li key={r.label}>
              <SmartLink
                href={r.href}
                className="cx-route"
                hideIcon
                event={r.href.includes('labs.zobique.com') ? { name: 'labs_cta_click', location: 'contact' } : { name: 'cta_click', label: r.label, destination: r.href }}
              >
                <span className="cx-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <strong>{r.label}{/^https?:\/\//.test(r.href) && <ExternalIcon />}</strong>
                <span className="cx-route-body">{r.body}</span>
                <ArrowRight className="cx-route-arrow" />
              </SmartLink>
            </li>
          ))}
        </ol>

        <section className="cx-form" aria-labelledby="form-heading">
          <div className="cx-form-head">
            <h2 id="form-heading" className="title-bar">{contact.form.heading}</h2>
            <p>{formNote}</p>
          </div>
          <ContactForm
            labelledBy="form-heading"
            reasons={contact.form.reasons}
            messages={{ success: contact.form.success, error: contact.form.error, rateLimited: contact.form.rateLimited }}
          />
        </section>
      </div>
    </>
  )
}
