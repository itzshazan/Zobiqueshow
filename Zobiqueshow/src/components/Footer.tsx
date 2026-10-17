import Link from 'next/link'
import { getProducts, site } from '@/lib/content'
import SmartLink from './SmartLink'
import { Mail, Phone, Pin, SocialIcon } from './icons'

export default function Footer() {
  const products = getProducts()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <img src={site.logo} alt="" width={30} height={30} />
              {site.brandName}
            </Link>
            <address><Pin className="footer-icon" />{site.address.display}</address>
            <div className="footer-contact">
              <a href={`mailto:${site.email}`}><Mail className="footer-icon" />{site.email}</a>
              <a href={site.phoneHref}><Phone className="footer-icon" />{site.phone}</a>
            </div>
            <ul className="socials" aria-label="Zobique on social media">
              {site.socials.map((s) => (
                <li key={s.url}>
                  <SmartLink href={s.url} className="social-btn" hideIcon>
                    <SocialIcon label={s.label} />
                    <span className="sr-only">{s.label}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-products">
            <h2 id="footer-products">Products</h2>
            <ul>
              {products.map((p) => (
                <li key={p.slug}><Link href={`/products/${p.slug}`}>{p.name}</Link></li>
              ))}
              <li><Link href="/products">All products</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company">Company</h2>
            <ul>
              <li><Link href="/labs">{site.labs.name}</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/about">About</Link></li>
              {site.features.insights && <li><Link href="/insights">Insights</Link></li>}
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

        </div>

        <div className="footer-base">
          <span>© {year} {site.legalName}</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
