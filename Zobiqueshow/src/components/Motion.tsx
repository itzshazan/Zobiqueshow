'use client'

import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Draws a .title-bar underline (CSS scaleX(var(--bar))) from 0 to full width when it scrolls into view
function drawBar(el: HTMLElement, duration: number, ease: string, start: string) {
  const bar = { v: 0 }
  el.style.setProperty('--bar', '0')
  gsap.to(bar, { v: 1, duration, ease, delay: 0.2, onUpdate: () => el.style.setProperty('--bar', String(bar.v)), scrollTrigger: { trigger: el, start } })
}

// Site-wide GSAP motion, applied by selector so pages stay plain server components.
// Runs again on every route change. Visitors who prefer reduced motion get a gentle version.
export default function Motion() {
  const pathname = usePathname()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const ease = 'power3.out'

        // Home hero: headline lines slide up out of their masks, then the rest follows
        const lines = gsap.utils.toArray<HTMLElement>('.wz-line > span')
        if (lines.length) {
          gsap.from(lines, { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.14 })
          gsap.from('.wz-sub, .wz-btn', { y: 24, opacity: 0, duration: 0.8, ease, stagger: 0.1, delay: 0.45 })
        }
        // Home hero image: rises in, grows to full width as you scroll
        const media = document.querySelector<HTMLElement>('.wz-media')
        if (media) {
          gsap.from(media, { y: 90, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.35 })
          gsap.fromTo(media, { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: media, start: 'top 85%', end: 'top 15%', scrub: true } })
        }

        // Partner logos drop in one after another
        ScrollTrigger.batch('.partners-set:first-child li', {
          start: 'top 92%',
          once: true,
          onEnter: (els) => gsap.from(els, { y: 20, opacity: 0, duration: 0.6, ease, stagger: 0.07, overwrite: true }),
        })

        // Section heading underline draws in from the left
        gsap.utils.toArray<HTMLElement>('.title-bar').forEach((el) => {
          drawBar(el, 0.9, 'power3.inOut', 'top 88%')
        })

        // Hero (product, labs, about): staggered entrance on load
        const heroParts = gsap.utils.toArray<HTMLElement>(
          '.cx-head > *, .hero2 h1, .hero2 .lede, .hero2-ctas, .pp-hero .pp-back, .pp-hero .pp-id, .pp-hero .eyebrow, .pp-hero h1, .pp-hero .lede, .pp-hero .hero-ctas, .ab-hero > .wrap > *, .page-head .wrap > *',
        )
        if (heroParts.length) gsap.from(heroParts, { y: 28, opacity: 0, duration: 0.8, ease, stagger: 0.08 })

        // Product windows rise in and settle at their tilt
        gsap.utils.toArray<HTMLElement>('.hero2-win, .pp-shot').forEach((win, i) => {
          gsap.from(win, { y: 80, opacity: 0, rotate: i % 2 ? 4 : -4, duration: 1.1, ease: 'power4.out', delay: 0.25 + i * 0.12 })
        })
        // Gentle parallax on the hero windows while scrolling away
        gsap.utils.toArray<HTMLElement>('.hero2-visual').forEach((v) => {
          gsap.to(v, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: v, start: 'top 70%', end: 'bottom top', scrub: true } })
        })

        // Section titles and intros rise in as they reach the viewport
        gsap.utils.toArray<HTMLElement>('.title-bar, .ft-head, .ab-label, .wf-intro').forEach((el) => {
          gsap.from(el, { y: 24, opacity: 0, duration: 0.7, ease, scrollTrigger: { trigger: el, start: 'top 88%' } })
        })

        // Cards and rows: staggered batches as they enter
        ScrollTrigger.batch(
          '.eng2-tile, .product-card, .case-feature, .ft, .pp2-grid > *, .pp2-caps li, .ab-row > div, .ab-row > dl, .work-more, .pp2-handoff-link, .route, .founder, .cta-band, .deck-card, .cx-routes li, .cx-direct, .cx-form, .feat-grid li',
          {
            start: 'top 90%',
            once: true,
            onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, duration: 0.8, ease, stagger: 0.1, overwrite: true }),
          },
        )

        // Two-engines loop badge spins in
        gsap.utils.toArray<HTMLElement>('.eng2-loop').forEach((b) => {
          gsap.from(b, { scale: 0, rotate: -180, duration: 0.9, ease: 'back.out(1.8)', scrollTrigger: { trigger: b, start: 'top 85%' } })
        })

        // Lazy images change heights after load; recalc trigger points
        const refresh = () => ScrollTrigger.refresh()
        window.addEventListener('load', refresh)
        return () => window.removeEventListener('load', refresh)
      })
      // Reduced motion: keep a gentle version (short fades, tiny lift, no tilt, parallax or spin)
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const soft = { opacity: 0, y: 8, duration: 0.45, ease: 'power1.out' }
        // Headline lines still slide out of their masks, just shorter
        const lines = gsap.utils.toArray<HTMLElement>('.wz-line > span')
        if (lines.length) gsap.from(lines, { yPercent: 100, duration: 0.6, ease: 'power2.out', stagger: 0.1 })
        // Heading underlines draw in (no movement, so it suits reduced motion)
        gsap.utils.toArray<HTMLElement>('.title-bar').forEach((el) => {
          drawBar(el, 0.6, 'power2.out', 'top 92%')
        })
        const heroParts = gsap.utils.toArray<HTMLElement>(
          '.wz-sub, .wz-btn, .wz-media, .cx-head > *, .hero2 h1, .hero2 .lede, .hero2-ctas, .hero2-win, .pp-hero .wrap > div > *, .pp-shot, .ab-hero > .wrap > *, .page-head .wrap > *',
        )
        if (heroParts.length) gsap.from(heroParts, { ...soft, stagger: 0.05 })
        ScrollTrigger.batch(
          '.title-bar, .ft-head, .ab-label, .wf-intro, .partners-set:first-child li, .eng2-tile, .eng2-loop, .product-card, .case-feature, .ft, .pp2-grid > *, .pp2-caps li, .ab-row > div, .ab-row > dl, .work-more, .pp2-handoff-link, .route, .founder, .cta-band, .deck-card, .cx-routes li, .cx-direct, .cx-form, .feat-grid li',
          { start: 'top 92%', once: true, onEnter: (els) => gsap.from(els, { ...soft, stagger: 0.05, overwrite: true }) },
        )
      })
      return () => mm.revert()
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
