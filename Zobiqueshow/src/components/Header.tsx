'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import SmartLink from './SmartLink'

export interface NavProduct {
  slug: string
  name: string
  oneLiner: string
  logo: string
  status: string
}

interface HeaderProps {
  brandName: string
  logo: string
  products: NavProduct[]
}

const links = [
  { label: 'Zobique Labs', href: '/labs' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
]

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Header({ brandName, logo, products }: HeaderProps) {
  const pathname = usePathname()
  const [productsOpen, setProductsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Over the home hero the bar takes the hero's orange; past it, it goes back to white
  const [onHero, setOnHero] = useState(pathname === '/' || pathname === '/contact')
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.wz-hero, .cx-band')
    if (!hero) {
      setOnHero(false)
      return
    }
    let frame = 0
    const check = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setOnHero(hero.getBoundingClientRect().bottom > 72))
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])

  const isCurrent = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? 'page' : undefined)

  // Close everything on navigation
  useEffect(() => {
    setProductsOpen(false)
    setMenuOpen(false)
  }, [pathname])

  // Dropdown: close on Escape (returning focus) and on click/focus outside
  useEffect(() => {
    if (!productsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductsOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onOutside = (e: Event) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setProductsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [productsOpen])

  const closeMenu = useCallback((returnFocus = true) => {
    setMenuOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  // Mobile menu: focus trap, Escape to close, page scroll locked behind it
  useEffect(() => {
    if (!menuOpen) return
    const menu = menuRef.current
    menu?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return closeMenu()
      if (e.key !== 'Tab' || !menu || !toggleRef.current) return
      const items = [toggleRef.current, ...menu.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 881px)')
    const onWide = () => mq.matches && closeMenu(false)
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [menuOpen, closeMenu])

  return (
    <header className={`site-header${onHero && !menuOpen ? ' is-on-hero' : ''}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="wrap header-row">
        <Link href="/" className="brand" aria-label={`${brandName} home`}>
          <img src={logo} alt="" width={30} height={30} />
          {brandName}
        </Link>

        <nav className="nav-main" aria-label="Main">
          <div
            className="dropdown"
            ref={dropdownRef}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              ref={triggerRef}
              type="button"
              className="nav-trigger"
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((o) => !o)}
            >
              Products <Chevron />
            </button>
            {productsOpen && (
              <div id="products-menu" className="dropdown-panel">
                <ul>
                  {products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="dd-item">
                        <span className="dd-logo"><img src={p.logo} alt="" width={28} height={28} /></span>
                        <span className="dd-text">
                          <strong>
                            {p.name}
                            <em className={`dd-status${p.status === 'live' ? ' is-live' : ''}`}>{p.status === 'live' ? 'Live' : 'Early access'}</em>
                          </strong>
                          <span>{p.oneLiner}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/products" className="dd-all">All products <span aria-hidden="true">→</span></Link>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={isCurrent(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <SmartLink
          href="/contact"
          className="btn btn-primary header-cta"
          event={{ name: 'cta_click', label: 'Contact', destination: '/contact' }}
        >
          Contact
        </SmartLink>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {menuOpen ? <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /> : <path d="M3 7h14M3 13h14" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="mobile-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu">
          <Link href="/products">Products</Link>
          <ul className="sub">
            {products.map((p) => (
              <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>
            ))}
          </ul>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <SmartLink href="/contact" className="btn btn-primary" event={{ name: 'cta_click', label: 'Contact', destination: '/contact' }}>
            Contact
          </SmartLink>
        </div>
      )}
    </header>
  )
}
