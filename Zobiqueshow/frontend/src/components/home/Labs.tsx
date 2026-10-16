'use client'

import { useRef } from 'react'
import Reveal from '@/components/shared/Reveal'
import { gsap, useGSAP, reducedMotion } from '@/lib/gsap'
import { LABS_URL } from '@/lib/constants'
import { labsServices, solutions, deliveryPhases, specs } from '@/data/content'
import SectionHead from '@/components/shared/SectionHead'

// Four phases on one track; the line fills as you scroll through it
function Timeline() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (reducedMotion()) {
      gsap.set('.tl-track i', { scaleX: 1 })
    } else {
      gsap.fromTo('.tl-track i', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: scope.current, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
      })
    }
    gsap.from('.tl-phases > li', {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: { trigger: scope.current, start: 'top 75%' },
    })
    gsap.from('.tl-node', {
      scale: 0,
      duration: 0.5,
      ease: 'back.out(3)',
      stagger: 0.15,
      scrollTrigger: { trigger: scope.current, start: 'top 75%' },
    })
  }, { scope })

  return (
    <div ref={scope} className="timeline">
      <div className="tl-span">
        <span>Week 0</span>
        <span className="tl-span-mid">2–16 weeks to production</span>
        <span>Live</span>
      </div>
      <div className="tl-track"><i /></div>
      <ol className="tl-phases">
        {deliveryPhases.map((p) => (
          <li key={p.title}>
            <span className="tl-node" />
            <h4>{p.title}</h4>
            <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function Labs() {
  return (
    <div className="labs-sec" id="labs">
      <section className="sec" style={{ borderTop: 0 }}>
        <div className="wrap">
          <SectionHead title="Production AI systems for business.">
            No templates. Every system is architected around one specific workflow in your business, built on how
            your operation actually runs.
          </SectionHead>

          <div className="wwd">
            {labsServices.map((s) => (
              <Reveal key={s.title}>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="sol-index">
            <Reveal className="sol-head">
              <h3>Solutions we ship</h3>
              <span>{solutions.length} systems, each built around one workflow</span>
            </Reveal>
            <div className="sol-cols">
              {[...new Set(solutions.map((s) => s.group))].map((group) => (
                <Reveal className="sol-col" key={group}>
                  <span className="sol-group">{group}</span>
                  <ul>
                    {solutions.filter((s) => s.group === group).map((s) => (
                      <li key={s.name}>
                        <a href={LABS_URL} target="_blank" rel="noopener">
                          <span className="sol-name">{s.name}</span>
                          <span className="sol-arr">→</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>

          <SectionHead
            title="From business problem to a system that runs."
            titleStyle={{ fontSize: 'clamp(30px,4vw,56px)' }}
            style={{ marginTop: 'clamp(80px,10vw,128px)', marginBottom: 40 }}
          />
          <Timeline />

          <Reveal className="specs">
            {specs.map(([label, values]) => (
              <div className="spec" key={label}>
                <span className="spec-k">{label}</span>
                <span className="spec-v">
                  {values.map((v, i) => <span key={v}>{v}{i < values.length - 1 && <i>/</i>}</span>)}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
