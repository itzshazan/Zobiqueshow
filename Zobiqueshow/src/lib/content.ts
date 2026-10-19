import 'server-only'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Client, Evidence, Product, Site, Testimonial, WorkItem } from './types'

import siteJson from '../../content/site.json'
import evidenceJson from '../../content/evidence.json'
import clientsJson from '../../content/clients.json'
import homeJson from '../../content/pages/home.json'
import labsJson from '../../content/pages/labs.json'
import aboutJson from '../../content/pages/about.json'
import contactJson from '../../content/pages/contact.json'
import sectionsJson from '../../content/pages/sections.json'
import legalJson from '../../content/pages/legal.json'

const CONTENT_DIR = join(process.cwd(), 'content')

function readDir<T>(dir: string): T[] {
  const full = join(CONTENT_DIR, dir)
  return readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(full, f), 'utf8')) as T)
}

export const site = siteJson as Site

/** Founder photo path, checked on every render so a newly added file shows without a restart */
export function founderPhoto(): string | null {
  const photo = site.founder.photo
  return photo && existsSync(join(process.cwd(), 'public', photo)) ? photo : null
}

export const evidence = evidenceJson as Evidence[]
export const pages = {
  home: homeJson,
  labs: labsJson,
  about: aboutJson,
  contact: contactJson,
  sections: sectionsJson,
  legal: legalJson,
}

// ---- Evidence and consent gates (brief section B) ----

const evidenceById = new Map(evidence.map((e) => [e.id, e]))

/** A claim may render only when every evidence entry behind it is verified. */
export function isVerified(...ids: (string | undefined)[]): boolean {
  return ids.every((id) => !id || evidenceById.get(id)?.status === 'verified')
}

// ---- Products ----

export function getProducts(): Product[] {
  return readDir<Product>('products').sort((a, b) => a.order - b.order)
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug)
}

/** Proof items that are allowed to show. */
export function visibleProof(product: Product) {
  return product.proof.filter((p) => isVerified(p.evidenceId))
}

// ---- Work ----

/** Work renders only with client consent and fully verified evidence. */
export function getWork(): WorkItem[] {
  return readDir<WorkItem>('work')
    .filter((w) => w.consent && isVerified(...w.evidenceIds))
    .sort((a, b) => a.order - b.order)
}

/** Work with its own page on zobique.com (product work). Labs work links out instead. */
export function getLocalWork(): WorkItem[] {
  return getWork().filter((w) => w.canonicalUrl === null)
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return getLocalWork().find((w) => w.slug === slug)
}

export function workHref(w: WorkItem): string {
  return w.canonicalUrl ?? `/case-studies/${w.slug}`
}

// ---- Testimonials and clients (render only with consent) ----

export function getTestimonials(): Testimonial[] {
  return readDir<Testimonial>('testimonials').filter((t) => t.consent)
}

export function getClients(): Client[] {
  return (clientsJson as Client[]).filter((c) => c.consent)
}
