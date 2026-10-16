'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import Reveal from '@/components/shared/Reveal'
import { LABS_URL } from '@/lib/constants'
import { companies } from '@/data/content'
import type { Company } from '@/types'
import SectionHead from '@/components/shared/SectionHead'

const tagClass = (t: string) => (t === 'Platform' ? 'p' : t === 'Labs' ? 'l' : '')

function CompanyCard({ name, desc, img, tags }: Company) {
  const [broken, setBroken] = useState(false)
  return (
    <Reveal className="co">
      <div className="logo">
        {img && !broken
          ? <img src={img} alt={`${name} logo`} loading="lazy" onError={() => setBroken(true)} />
          : <span className="txt">{name}</span>}
      </div>
      {/* When the logo is just the name in text, don't repeat it underneath */}
      <div>{img && !broken && <h5>{name}</h5>}<div className="desc">{desc}</div></div>
      <div className="tags">{tags.map((t) => <span key={t} className={tagClass(t)}>{t}</span>)}</div>
    </Reveal>
  )
}

export default function Work() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (reducedMotion()) return
    // The screenshot drifts inside its browser frame as the page scrolls past
    gsap.fromTo('.case-shot img', { yPercent: -6, scale: 1.13 }, {
      yPercent: 6,
      scale: 1.13,
      ease: 'none',
      scrollTrigger: { trigger: '.case-shot', start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }, { scope })

  return (
    <section ref={scope} className="sec" id="work" style={{ borderTop: 0 }}>
      <div className="wrap">
        <SectionHead title="Shipped, live and in production.">
          From a government-scale deployment to the startups building on top of us.
        </SectionHead>

        <Reveal as="article" className="case">
          <div className="case-text">
            <span className="case-status"><i className="dot" />Live · Government of India</span>
            <h3>A live AI service inside the National Career Service.</h3>
            <p>
              A job and skill matching algorithm integrated directly into the Government of India's NCS ecosystem,
              connecting job seekers with the right opportunities.
            </p>
            <dl className="case-facts">
              <div><dt>Client</dt><dd>National Career Service, Ministry of Labour &amp; Employment</dd></div>
              <div><dt>Built by</dt><dd>Zobique Labs × Zobique Platform</dd></div>
              <div><dt>Delivers</dt><dd>AI job matching, resume builder, ATS checker, career roadmaps</dd></div>
            </dl>
            <a className="btn btn-o" href="https://ncs.zobique.com/" target="_blank" rel="noopener">
              Visit ncs.zobique.com <span className="arr">→</span>
            </a>
          </div>
          <a className="case-shot" href="https://ncs.zobique.com/" target="_blank" rel="noopener" aria-label="Open ncs.zobique.com">
            <div className="browser-bar"><i /><i /><i /><span>ncs.zobique.com</span></div>
            <img src="/work/ncs.jpg" alt="The Zobique × NCS job portal homepage" loading="lazy" width="1440" height="860" />
          </a>
        </Reveal>

        <Reveal className="press">
          <span className="press-k">As featured in</span>
          <span className="press-name">India Today</span>
          <p>How a founder's career insight became an AI platform used by thousands of students.</p>
          {/* TODO: replace with the India Today article URL */}
          <a href={LABS_URL} target="_blank" rel="noopener">Read the story →</a>
        </Reveal>

        <SectionHead
          title="We've built with founders, institutions and enterprises."
          titleStyle={{ fontSize: 'clamp(30px,4vw,56px)' }}
          style={{ margin: '96px 0 32px' }}
        />
        <div className="grid-co">
          {companies.map((c) => <CompanyCard key={c.name} {...c} />)}
        </div>
      </div>
    </section>
  )
}
