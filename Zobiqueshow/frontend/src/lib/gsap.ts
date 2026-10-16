import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Next also renders this on the server, where there is no window
if (typeof window !== 'undefined') {
  // Lazy images change the page height after first layout; recalc trigger points
  window.addEventListener('load', () => ScrollTrigger.refresh())
}

// Scroll-tied effects (parallax, scrubbed fills) are skipped for people who
// ask for reduced motion; entrance animations still play, just shorter.
export const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, useGSAP }
