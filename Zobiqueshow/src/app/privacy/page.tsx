import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { pages } from '@/lib/content'

const copy = pages.legal.privacy

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <LegalPage {...copy} />
}
