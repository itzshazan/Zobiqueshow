'use client'

import { useState } from 'react'
import { testimonials } from '@/data/content'
import Reveal from '@/components/shared/Reveal'

export default function Testimonials() {
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
