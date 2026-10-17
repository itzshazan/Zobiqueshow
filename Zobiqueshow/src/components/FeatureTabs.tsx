'use client'

import { useEffect, useRef, useState } from 'react'
import SmartLink from './SmartLink'
import { ArrowRight, Check, FileText, Headset, Layers, Target } from './icons'

// zobique.com "Our Features" styling as a scroll-linked list: the tab list on the left stays
// pinned while every card scrolls on the right; the entry for the card crossing the middle
// of the screen is selected. Clicking an entry scrolls to its card. On phones the list
// becomes a sticky chip row above the cards.

export interface FeatureTab {
  key: string
  label: string
  icon: 'target' | 'headset' | 'file' | 'layers'
  tone: 'orange' | 'green' | 'blue'
  title: string
  body: string
  benefits: string[]
  /** fit: 'cover' fills the panel (default); 'contain' shows the whole image on bg */
  image?: { src: string; width: number; height: number; alt: string; fit?: 'cover' | 'contain'; bg?: string }
  link: { label: string; href: string }
}

const ICONS = { target: Target, headset: Headset, file: FileText, layers: Layers }

export default function FeatureTabs({ tabs, keyBenefitsLabel, idPrefix }: { tabs: FeatureTab[]; keyBenefitsLabel: string; idPrefix: string }) {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const cards = tabs.map((t) => document.getElementById(`${idPrefix}-card-${t.key}`)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(cards.indexOf(e.target as HTMLElement))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [tabs, idPrefix])

  // Keep the selected chip visible in the phone chip row
  useEffect(() => {
    const chip = chipRefs.current[active]
    const list = listRef.current
    if (chip && list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' })
    }
  }, [active])

  const go = (key: string) => {
    const el = document.getElementById(`${idPrefix}-card-${key}`)
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const y = el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <div className="ft ft-pinned">
      <div className="ft-list-wrap">
        <div className="ft-list" ref={listRef} aria-label="Systems we build">
          {tabs.map((tab, i) => {
            const Icon = ICONS[tab.icon]
            const selected = i === active
            return (
              <button
                key={tab.key}
                ref={(el) => { chipRefs.current[i] = el }}
                type="button"
                aria-current={selected ? 'true' : undefined}
                aria-controls={`${idPrefix}-card-${tab.key}`}
                className={`ft-tab${selected ? ' is-active' : ''}`}
                onClick={() => go(tab.key)}
              >
                <span className={`ft-icon tone-${tab.tone}`} aria-hidden="true"><Icon /></span>
                <span className="ft-label">{tab.label}</span>
                <ArrowRight className="ft-chevron" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="ft-cards">
        {tabs.map((t, i) => {
          const Icon = ICONS[t.icon]
          return (
            <article key={t.key} id={`${idPrefix}-card-${t.key}`} className={`ft-card${i === active ? ' is-active' : ''}`} aria-labelledby={`${idPrefix}-title-${t.key}`}>
              <div className="ft-body">
                <span className={`ft-icon ft-icon-lg tone-${t.tone}`} aria-hidden="true"><Icon /></span>
                <h3 id={`${idPrefix}-title-${t.key}`}>{t.title}</h3>
                <p className="ft-desc">{t.body}</p>
                {t.image && (
                  <ul className="ft-inline-benefits" aria-label={keyBenefitsLabel}>
                    {t.benefits.map((b) => <li key={b}><Check className="ft-check" />{b}</li>)}
                  </ul>
                )}
                <SmartLink href={t.link.href} className="ft-explore" hideIcon event={{ name: 'labs_cta_click', location: `features-${t.key}` }}>
                  {t.link.label}<ArrowRight className="ft-arrow" />
                </SmartLink>
              </div>
              {t.image ? (
                <div className={`ft-visual${t.image.fit === 'contain' ? ' is-contain' : ''}`} style={t.image.bg ? { background: t.image.bg } : undefined}>
                  <img src={t.image.src} alt={t.image.alt} width={t.image.width} height={t.image.height} loading="lazy" />
                </div>
              ) : (
                <div className="ft-benefits">
                  <h4>{keyBenefitsLabel}</h4>
                  <ul>
                    {t.benefits.map((b) => (
                      <li key={b}><Check className="ft-check" />{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
