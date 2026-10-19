// Content guard (brief sections B, G, K).
//
//   node scripts/content-guard.mjs              validate content/, warn on unverified evidence
//   node scripts/content-guard.mjs --production also fail on any [PLACEHOLDER] text
//   node scripts/content-guard.mjs --scan-build fail if [PLACEHOLDER] reached the built HTML
//
// Set ALLOW_PLACEHOLDERS=1 to build a preview that still contains placeholders.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PLACEHOLDER = '[PLACEHOLDER'
export const PRODUCT_STATUSES = ['live', 'early-access', 'beta', 'in-development']
export const EVIDENCE_STATUSES = ['verified', 'published', 'unverified', 'conflicting', 'high-risk', 'misclassified']
export const WORK_OWNERS = ['zobique', 'labs']
const MAX_CAPABILITIES = 6

const isStr = (v) => typeof v === 'string' && v.trim().length > 0
const isOptStr = (v) => v === null || v === undefined || isStr(v)
const isBool = (v) => typeof v === 'boolean'
const isArr = (v) => Array.isArray(v)
const isUrlish = (v) => isStr(v) && (/^https:\/\//.test(v) || v.startsWith('/') || v.startsWith('#'))

/** Every string value in a JSON tree, with its path. */
export function* strings(node, path = '') {
  if (typeof node === 'string') yield [path, node]
  else if (Array.isArray(node)) for (let i = 0; i < node.length; i++) yield* strings(node[i], `${path}[${i}]`)
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) yield* strings(v, path ? `${path}.${k}` : k)
}

export function findPlaceholders(files) {
  const hits = []
  for (const [file, data] of Object.entries(files)) {
    for (const [path, value] of strings(data)) if (value.includes(PLACEHOLDER)) hits.push(`${file} → ${path}`)
  }
  return hits
}

function check(errors, file, cond, msg) {
  if (!cond) errors.push(`${file}: ${msg}`)
}

function checkScreenshots(errors, file, shots) {
  check(errors, file, isArr(shots), 'screenshots must be an array')
  for (const [i, s] of (shots || []).entries()) {
    check(errors, file, isUrlish(s?.src), `screenshots[${i}].src missing`)
    check(errors, file, isStr(s?.alt), `screenshots[${i}].alt is required (meaningful alt text)`)
    check(errors, file, Number.isInteger(s?.width) && Number.isInteger(s?.height), `screenshots[${i}] needs integer width and height`)
  }
}

export function validateProduct(file, p, evidenceIds) {
  const errors = []
  for (const k of ['slug', 'name', 'logo', 'category', 'oneLiner', 'audience', 'problem', 'url', 'ctaLabel']) {
    check(errors, file, isStr(p[k]), `${k} is required`)
  }
  check(errors, file, /^[a-z0-9-]+$/.test(p.slug ?? ''), 'slug must be lowercase-kebab-case')
  check(errors, file, PRODUCT_STATUSES.includes(p.status), `status must be one of ${PRODUCT_STATUSES.join(', ')}`)
  check(errors, file, isArr(p.capabilities) && p.capabilities.length > 0 && p.capabilities.length <= MAX_CAPABILITIES, `capabilities must have 1–${MAX_CAPABILITIES} items`)
  check(errors, file, isUrlish(p.url) && p.url.startsWith('https://'), 'url must be an https URL to the product site')
  check(errors, file, Number.isInteger(p.order), 'order must be an integer')
  checkScreenshots(errors, file, p.screenshots)
  check(errors, file, isArr(p.proof), 'proof must be an array')
  for (const [i, pr] of (p.proof || []).entries()) {
    check(errors, file, isStr(pr.text), `proof[${i}].text is required`)
    check(errors, file, evidenceIds.has(pr.evidenceId), `proof[${i}].evidenceId "${pr.evidenceId}" is not in evidence.json`)
  }
  if (p.capabilitiesEvidenceId) check(errors, file, evidenceIds.has(p.capabilitiesEvidenceId), `capabilitiesEvidenceId "${p.capabilitiesEvidenceId}" is not in evidence.json`)
  return errors
}

export function validateWork(file, w, evidenceIds) {
  const errors = []
  for (const k of ['slug', 'title', 'outcome', 'client', 'problem', 'built', 'result', 'resultDefinition']) {
    check(errors, file, isStr(w[k]), `${k} is required`)
  }
  check(errors, file, WORK_OWNERS.includes(w.owner), `owner must be one of ${WORK_OWNERS.join(', ')}`)
  check(errors, file, isBool(w.consent), 'consent must be true or false')
  check(errors, file, isArr(w.evidenceIds) && w.evidenceIds.length > 0, 'evidenceIds must list at least one evidence entry')
  for (const id of w.evidenceIds || []) check(errors, file, evidenceIds.has(id), `evidence "${id}" is not in evidence.json`)
  check(errors, file, w.canonicalUrl === null || (isStr(w.canonicalUrl) && w.canonicalUrl.startsWith('https://')), 'canonicalUrl must be null or an https URL')
  check(errors, file, w.owner === 'labs' || w.canonicalUrl === null, 'product work (owner "zobique") must have its canonical page on zobique.com (canonicalUrl null)')
  check(errors, file, isOptStr(w.logo), 'logo must be a string or null')
  checkScreenshots(errors, file, w.screenshots)
  return errors
}

export function validateTestimonial(file, t) {
  const errors = []
  for (const k of ['quote', 'name', 'role', 'company']) check(errors, file, isStr(t[k]), `${k} is required`)
  check(errors, file, isBool(t.consent), 'consent must be true or false')
  return errors
}

export function validateEvidence(file, list) {
  const errors = []
  check(errors, file, isArr(list), 'must be an array')
  const seen = new Set()
  for (const [i, e] of (list || []).entries()) {
    check(errors, file, isStr(e.id), `[${i}].id is required`)
    check(errors, file, !seen.has(e.id), `duplicate id "${e.id}"`)
    seen.add(e.id)
    check(errors, file, EVIDENCE_STATUSES.includes(e.status), `[${i}] "${e.id}" status must be one of ${EVIDENCE_STATUSES.join(', ')}`)
    check(errors, file, isStr(e.claim), `[${i}] "${e.id}" claim is required`)
  }
  return errors
}

export function validateSite(file, s) {
  const errors = []
  for (const k of ['brandName', 'legalName', 'brandLine', 'url', 'email', 'phone', 'phoneHref']) check(errors, file, isStr(s[k]), `${k} is required`)
  check(errors, file, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email ?? ''), 'email must be an email address')
  check(errors, file, isStr(s.address?.display), 'address.display is required')
  check(errors, file, isStr(s.founder?.name) && isStr(s.founder?.role), 'founder.name and founder.role are required')
  check(errors, file, isArr(s.socials), 'socials must be an array')
  return errors
}

/** Evidence IDs that content references but that are not verified (those claims are hidden). */
export function unverifiedReferences(files, evidence) {
  const status = new Map(evidence.map((e) => [e.id, e.status]))
  const out = new Map()
  for (const [file, data] of Object.entries(files)) {
    for (const [path, value] of strings(data)) {
      if (!/(evidenceId|evidenceIds\[\d+\]|EvidenceIds\[\d+\]|EvidenceId)$/.test(path)) continue
      const s = status.get(value)
      if (s && s !== 'verified') {
        if (!out.has(value)) out.set(value, { status: s, refs: [] })
        out.get(value).refs.push(`${file} → ${path}`)
      }
    }
  }
  return out
}

export function loadContent(dir) {
  const files = {}
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (name.endsWith('.json')) files[relative(dir, p).replaceAll('\\', '/')] = JSON.parse(readFileSync(p, 'utf8'))
    }
  }
  walk(dir)
  return files
}

export function validateAll(files) {
  const errors = []
  const evidence = files['evidence.json']
  if (!evidence) return { errors: ['evidence.json is missing'], warnings: [] }
  errors.push(...validateEvidence('evidence.json', evidence))
  const ids = new Set(evidence.map((e) => e.id))
  if (files['site.json']) errors.push(...validateSite('site.json', files['site.json']))
  else errors.push('site.json is missing')

  const slugs = new Map()
  for (const [file, data] of Object.entries(files)) {
    if (file.startsWith('products/')) errors.push(...validateProduct(file, data, ids))
    if (file.startsWith('work/')) errors.push(...validateWork(file, data, ids))
    if (file.startsWith('testimonials/')) errors.push(...validateTestimonial(file, data))
    if (file.startsWith('products/') || file.startsWith('work/')) {
      const key = `${file.split('/')[0]}:${data.slug}`
      if (slugs.has(key)) errors.push(`${file}: slug "${data.slug}" is also used by ${slugs.get(key)}`)
      slugs.set(key, file)
      if (`${data.slug}.json` !== file.split('/')[1]) errors.push(`${file}: file name must match slug "${data.slug}"`)
    }
  }

  const warnings = []
  for (const [id, { status, refs }] of unverifiedReferences(files, evidence)) {
    warnings.push(`evidence "${id}" is ${status}; hidden on the site until verified (${refs.length} reference${refs.length > 1 ? 's' : ''})`)
  }
  return { errors, warnings }
}

/** Every built HTML file that still contains placeholder text. */
export function scanBuild(buildDir) {
  const hits = []
  if (!existsSync(buildDir)) return hits
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(html|rsc|body)$/.test(name) && readFileSync(p, 'utf8').includes(PLACEHOLDER)) hits.push(relative(buildDir, p))
    }
  }
  walk(buildDir)
  return hits
}

// ---- CLI ----
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const args = new Set(process.argv.slice(2))
  const allow = process.env.ALLOW_PLACEHOLDERS === '1'
  let failed = false

  if (args.has('--scan-build')) {
    const hits = scanBuild(join(root, '.next', 'server', 'app'))
    if (hits.length && !allow) {
      console.error(`✖ [PLACEHOLDER] text reached the build:\n  ${hits.join('\n  ')}`)
      process.exit(1)
    }
    console.log(hits.length ? `⚠ placeholders in build (allowed): ${hits.length}` : '✓ no placeholders in built pages')
    process.exit(0)
  }

  const files = loadContent(join(root, 'content'))
  const { errors, warnings } = validateAll(files)
  for (const w of warnings) console.warn(`⚠ ${w}`)
  if (errors.length) {
    console.error(`✖ content errors:\n  ${errors.join('\n  ')}`)
    failed = true
  }
  const placeholders = findPlaceholders(files)
  if (placeholders.length) {
    const msg = `[PLACEHOLDER] text in content:\n  ${placeholders.join('\n  ')}`
    if (args.has('--production') && !allow) {
      console.error(`✖ ${msg}`)
      failed = true
    } else console.warn(`⚠ ${msg}`)
  }
  if (failed) process.exit(1)
  console.log(`✓ content valid (${Object.keys(files).length} files)`)
}
