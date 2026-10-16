import { useRef } from 'react'
import { gsap, useGSAP, reducedMotion } from '../../lib/gsap'
import { marquee, PLATFORM_URL, LABS_URL } from '../../data/content'
import LogoLoop from '../ui/LogoLoop'

// Line-art illustrations in the style of High Alpha's hero cards
function StepsArt() {
  // Rising isometric blocks: a career climbing
  const blocks = [
    { x: 10, h: 30 }, { x: 46, h: 58 }, { x: 82, h: 92 }, { x: 118, h: 132 },
  ]
  return (
    <svg className="hero-art" viewBox="0 0 180 170" fill="none" aria-hidden="true">
      {blocks.map(({ x, h }) => {
        const base = 160
        const top = base - h
        return (
          <g key={x}>
            <path d={`M${x} ${top + 10} L${x + 18} ${top} L${x + 36} ${top + 10} L${x + 18} ${top + 20} Z`} />
            <path d={`M${x} ${top + 10} V${base - 10} L${x + 18} ${base} V${top + 20}`} />
            <path d={`M${x + 36} ${top + 10} V${base - 10} L${x + 18} ${base}`} />
          </g>
        )
      })}
    </svg>
  )
}

function CubesArt() {
  // Interlocking cubes: connected systems
  const cube = (x, y, s = 26) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x} ${y} L${x + s} ${y - s / 2} L${x + 2 * s} ${y} L${x + s} ${y + s / 2} Z`} />
      <path d={`M${x} ${y} V${y + s} L${x + s} ${y + 1.5 * s} V${y + s / 2}`} />
      <path d={`M${x + 2 * s} ${y} V${y + s} L${x + s} ${y + 1.5 * s}`} />
    </g>
  )
  return (
    <svg className="hero-art" viewBox="0 0 180 170" fill="none" aria-hidden="true">
      {cube(64, 20)}
      {cube(38, 59)}
      {cube(90, 59)}
      {cube(12, 98)}
      {cube(116, 98)}
      {cube(64, 98)}
    </svg>
  )
}

const cards = [
  {
    name: 'Zobique',
    body: 'AI career intelligence for students, graduates and universities.',
    href: PLATFORM_URL,
    Art: StepsArt,
    variant: 'platform',
  },
  {
    name: 'Zobique Labs',
    body: 'We design, build and deploy production AI systems for business.',
    href: LABS_URL,
    Art: CubesArt,
    variant: 'labs',
  },
]

export default function Hero() {
  const scope = useRef(null)

  useGSAP(() => {
    const quick = reducedMotion()
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: quick ? 0.5 : 1.1 } })

    // Each headline line rises out of its own mask
    tl.from('.hero h1 .line-in', { yPercent: 110, stagger: 0.12 })
      .from('.hero-lede', { y: 24, opacity: 0, duration: 0.9 }, '-=0.75')
      .from('.hero-card', { y: 60, opacity: 0, stagger: 0.12, duration: 1 }, '-=0.6')

    // The line drawings sketch themselves in once the cards have landed
    const paths = gsap.utils.toArray('.hero-art path')
    paths.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    tl.to(paths, { strokeDashoffset: 0, duration: quick ? 0.6 : 1.4, ease: 'power2.inOut', stagger: 0.02 }, '-=0.5')
      .from('.loop.clients', { opacity: 0, y: 16, duration: 0.8 }, '-=1.2')
  }, { scope })

  return (
    <div ref={scope}>
      <header className="hero" id="top">
        <div className="wrap">
          <div className="hero-top">
            <h1>
              <span className="line"><span className="line-in">Turning Skills into Careers</span></span>
              <span className="line accent"><span className="line-in">and Workflows into Systems</span></span>
            </h1>
            <p className="hero-lede">
              <b>Zobique is an AI company.</b> We build career intelligence for students and universities, and
              production AI systems for the businesses that hire them.
            </p>
          </div>

          <div className="hero-cards">
            {cards.map(({ name, body, href, Art, variant }) => (
              <a key={name} href={href} target="_blank" rel="noopener" className={`hero-card ${variant}`}>
                <div>
                  <h2>
                    {name}
                    <span className="hero-card-arr" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M7 12h10M13 8l4 4-4 4" /></svg>
                    </span>
                  </h2>
                  <p>{body}</p>
                </div>
                <Art />
              </a>
            ))}
          </div>
        </div>
      </header>

      <LogoLoop label="Trusted by teams at" logos={marquee} variant="clients" speed={45} />
    </div>
  )
}
