import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { pages } from '@/lib/content'

const copy = pages.legal.terms

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <LegalPage {...copy} />
}
