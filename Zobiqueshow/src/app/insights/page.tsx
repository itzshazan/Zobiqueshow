import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHead } from '@/components/blocks'
import { pages, site } from '@/lib/content'

const copy = pages.sections.insights

// Built but switched off until there are at least three real posts:
// set features.insights to true in content/site.json to show it in nav, footer and sitemap.
export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  robots: site.features.insights ? undefined : { index: false, follow: false },
}

export default function InsightsPage() {
  if (!site.features.insights) notFound()
  return (
    <>
      <PageHead title={copy.heading} />
      <div className="wrap" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <p className="muted">{copy.empty}</p>
      </div>
    </>
  )
}
