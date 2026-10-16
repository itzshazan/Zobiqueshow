'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { LABS_URL, NCS_URL, PLATFORM_URL, ext } from '@/lib/constants'
import { socials } from '@/data/content'
import Brand from '@/components/shared/Brand'

export default function Footer() {
  const scope = useRef<HTMLElement>(null)

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
              <li><a href={NCS_URL} {...ext}>NCS deployment</a></li>
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
