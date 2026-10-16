import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { Reveal } from '../../hooks'
import { LABS_URL, PLATFORM_URL, testimonials, faqs, contacts, socials } from '../../data/content'
import SectionHead from '../ui/SectionHead'
import { Brand } from '../ui/Nav'

export function Testimonials() {
  const [active, setActive] = useState(0)
  const t = testimonials[active]

  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="voices">
          <div className="voices-side">
            <h2>In their words</h2>
            <ul role="tablist">
              {testimonials.map((v, i) => (
                <li key={v.name}>
                  <button
                    role="tab"
                    aria-selected={i === active}
                    className={i === active ? 'on' : ''}
                    onClick={() => setActive(i)}
                  >
                    <b>{v.name}</b>
                    <span>{v.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <figure className="voices-quote" key={active}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.name}, {t.role}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

export function Faq() {
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead title="Questions, answered." />
        <Reveal className="faq">
          {faqs.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export function Contact() {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.from('.cta h2 .line-in', {
      yPercent: 110,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.cta h2', start: 'top 80%' },
    })
  }, { scope })

  return (
    <section ref={scope} className="cta" id="contact">
      <div className="wrap">
        <h2>
          <span className="line"><span className="line-in">Tell us the workflow</span></span>
          <span className="line"><span className="line-in">costing you time.</span></span>
          <span className="line">
            <a className="line-in" href={LABS_URL} target="_blank" rel="noopener">Book a call →</a>
          </span>
        </h2>
        <Reveal as="ul" className="contacts">
          {contacts.map((c) => (
            <li key={c.value}>
              <a href={c.href} {...(c.href.startsWith('http') ? ext : {})}>
                <span className="contact-k">{c.label}</span>
                <span className="contact-v">{c.value}</span>
                <span className="contact-arr" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

const ext = { target: '_blank', rel: 'noopener' }

export function Footer() {
  const scope = useRef(null)

  useGSAP(() => {
    gsap.from('.wordmark span', {
      yPercent: 100,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.05,
      scrollTrigger: { trigger: '.wordmark', start: 'top 95%' },
    })
  }, { scope })

  return (
    <footer ref={scope}>
      <div className="wrap">
        <div className="foot">
          <div>
            <Brand />
            <address>Manav Rachna Campus Rd, Sector 43, Faridabad, Haryana, India</address>
          </div>
          <div>
            <h6 className="mono muted">Platform</h6>
            <ul>
              <li><a href={PLATFORM_URL} {...ext}>zobique.com</a></li>
              <li><a href="https://www.zobique.com/sign-up" {...ext}>Get started free</a></li>
              <li><a href="https://blog.zobique.com/" {...ext}>Blog</a></li>
            </ul>
          </div>
          <div>
            <h6 className="mono muted">Labs</h6>
            <ul>
              <li><a href={LABS_URL} {...ext}>labs.zobique.com</a></li>
              <li><a href="https://ncs.zobique.com/" {...ext}>NCS deployment</a></li>
              <li><a href="mailto:contact@zobique.com">Start a project</a></li>
            </ul>
          </div>
          <div>
            <h6 className="mono muted">Social</h6>
            <ul>
              {socials.map(([label, href]) => <li key={href}><a href={href} {...ext}>{label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="wordmark" aria-hidden="true">
          {'zobique'.split('').map((ch, i) => <span key={i}>{ch}</span>)}
          <span className="dot">.</span>
        </div>
        <div className="legal mono muted">
          <span>© {new Date().getFullYear()} Zobique. All rights reserved.</span>
          <span>
            <a href="https://www.zobique.com/privacy-policy" {...ext}>Privacy</a> · <a href="https://www.zobique.com/terms-and-conditions" {...ext}>Terms</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
