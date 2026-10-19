import type { Metadata } from 'next'
import { PageHead, ProductCard } from '@/components/blocks'
import { getProducts, pages } from '@/lib/content'

const copy = pages.sections.products

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: '/products' },
}

export default function ProductsPage() {
  return (
    <>
      <PageHead title={copy.heading} lede={copy.intro} />
      <section className="wrap" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <div className="product-grid">
          {getProducts().map((p) => <ProductCard key={p.slug} product={p} headingLevel={2} />)}
        </div>
      </section>
    </>
  )
}
