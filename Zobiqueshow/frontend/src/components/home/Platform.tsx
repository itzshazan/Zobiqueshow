'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import Reveal from '@/components/shared/Reveal'
import { PLATFORM_URL } from '@/lib/constants'
import { platformServices, matches, topCompanies } from '@/data/content'
import SectionHead from '@/components/shared/SectionHead'
import LogoLoop from '@/components/ui/LogoLoop'

function Demo() {
  const [ref, inView] = useInView()
  const [scanned, setScanned] = useState(17847)

  useEffect(() => {
    const id = setInterval(() => setScanned((n) => n + Math.floor(Math.random() * 4) + 1), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div ref={ref} className={`demo rv ${inView ? 'in' : ''}`}>
      <div className="demo-top">
        <h5>Your top matches</h5>
        <span className="scan">{scanned.toLocaleString('en-IN')} jobs scanned</span>
      </div>
      <ol className="matches">
        {matches.map(([role, company, pct], i) => (
          <li className={`match ${i === 0 ? 'best' : ''}`} key={role}>
            <span className="match-logo">
              <img src={`/logos/${company.toLowerCase()}.svg`} alt={company} loading="lazy" />
            </span>
            <span className="r">
              {role}
              {i === 0 && <em>Best match</em>}
            </span>
            <span className="pct">{pct}<small>%</small></span>
          </li>
        ))}
      </ol>
      <div className="demo-foot">
        <a href={PLATFORM_URL} target="_blank" rel="noopener" className="btn btn-o">
          See my matches <span className="arr">→</span>
        </a>
        <span className="note">Sample results from the zobique.com demo</span>
      </div>
    </div>
  )
}

export default function Platform() {
  const [active, setActive] = useState(0)

  return (
    <section className="sec" id="platform">
      <div className="wrap">
        <SectionHead title="Turn skills into success with AI career intelligence.">
          Agentic career management that predicts the roles you fit, optimizes your resume for ATS and manages
          applications for you, from your first internship to your next role.
        </SectionHead>

        <div className="plat">
          <Reveal className="tabs">
            {platformServices.map((s, i) => (
              <button key={s.title} className={`tab ${i === active ? 'on' : ''}`} onClick={() => setActive(i)}>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </button>
            ))}
          </Reveal>
          <Demo />
        </div>

        <Reveal className="hiring">
          <LogoLoop label="Matching students to roles at" logos={topCompanies} variant="grayscale" speed={35} />
        </Reveal>
      </div>
    </section>
  )
}
