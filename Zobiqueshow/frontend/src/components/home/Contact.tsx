'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { LABS_URL, ext } from '@/lib/constants'
import { contacts } from '@/data/content'
import Reveal from '@/components/shared/Reveal'

export default function Contact() {
  const scope = useRef<HTMLElement>(null)

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
