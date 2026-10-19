// Shapes of the files in content/. scripts/content-guard.mjs enforces them at build time.

export type ProductStatus = 'live' | 'early-access' | 'beta' | 'in-development'
export type EvidenceStatus = 'verified' | 'published' | 'unverified' | 'conflicting' | 'high-risk' | 'misclassified'
export type WorkOwner = 'zobique' | 'labs'

export interface Link {
  label: string
  href: string
}

export interface Screenshot {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

export interface Evidence {
  id: string
  claim: string
  source: string
  status: EvidenceStatus
  note?: string
}

export interface ProofItem {
  text: string
  evidenceId: string
  href?: string
}

export interface Product {
  slug: string
  name: string
  logo: string
  /** Square icon for small spots like the nav menu; falls back to logo */
  mark?: string
  category: string
  oneLiner: string
  audience: string
  problem: string
  capabilities: string[]
  /** Title + one line for the product page; cards keep the short capabilities list */
  capabilityDetails?: { title: string; detail: string }[]
  capabilitiesEvidenceId?: string
  status: ProductStatus
  url: string
  ctaLabel: string
  screenshots: Screenshot[]
  proof: ProofItem[]
  labsNote: string | null
  order: number
}

export interface WorkItem {
  slug: string
  /** Small uppercase label on the card, e.g. Government-facing deployment */
  eyebrow?: string
  title: string
  outcome: string
  client: string
  owner: WorkOwner
  context: string | null
  problem: string
  built: string
  components: { name: string; detail: string }[]
  flow: string[]
  result: string
  resultDefinition: string
  evidenceIds: string[]
  canonicalUrl: string | null
  liveUrl: string | null
  logo: string | null
  consent: boolean
  screenshots: Screenshot[]
  cta: Link | null
  /** Shorter Problem / What we built / Result lines for cards; the full text stays on the case study page */
  card?: { problem: string; built: string; result: string; resultDefinition: string }
  order: number
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  workSlug?: string
  consent: boolean
}

export interface Client {
  name: string
  logo: string | null
  /** Visual size tweak for logos with a lot of whitespace or a square shape */
  scale?: number
  consent: boolean
}

export interface Site {
  brandName: string
  legalName: string
  brandLine: string
  url: string
  email: string
  phone: string
  phoneHref: string
  address: { street: string; locality: string; region: string; country: string; display: string }
  logo: string
  labs: { name: string; url: string; contactUrl: string; caseStudiesUrl: string }
  founder: {
    name: string
    role: string
    evidenceId: string
    story: string | null
    photo: string | null
    linkedin: string | null
  }
  socials: { label: string; url: string }[]
  features: { insights: boolean }
}
