import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  findPlaceholders,
  validateProduct,
  validateWork,
  validateEvidence,
  validateAll,
  unverifiedReferences,
  loadContent,
} from './content-guard.mjs'

const ids = new Set(['ncs', 'press'])

const product = () => ({
  slug: 'demo', name: 'Demo', logo: '/l.png', category: 'c', oneLiner: 'o', audience: 'a', problem: 'p',
  capabilities: ['one'], status: 'live', url: 'https://demo.zobique.com', ctaLabel: 'Open',
  screenshots: [{ src: '/s.jpg', alt: 'A screen', width: 10, height: 10 }], proof: [{ text: 't', evidenceId: 'ncs' }], order: 1,
})

const work = () => ({
  slug: 'w', title: 't', outcome: 'o', client: 'c', owner: 'zobique', problem: 'p', built: 'b', result: 'r',
  resultDefinition: 'd', evidenceIds: ['ncs'], canonicalUrl: null, logo: null, consent: true, screenshots: [],
})

test('a valid product passes', () => {
  assert.deepEqual(validateProduct('p.json', product(), ids), [])
})

test('product status is limited to the four chip values', () => {
  assert.match(validateProduct('p.json', { ...product(), status: 'launched' }, ids).join(), /status must be one of/)
})

test('products allow at most six capabilities', () => {
  assert.match(validateProduct('p.json', { ...product(), capabilities: Array(7).fill('x') }, ids).join(), /capabilities/)
})

test('screenshots need alt text', () => {
  const p = { ...product(), screenshots: [{ src: '/s.jpg', alt: '', width: 1, height: 1 }] }
  assert.match(validateProduct('p.json', p, ids).join(), /alt is required/)
})

test('proof must reference a known evidence id', () => {
  const p = { ...product(), proof: [{ text: 't', evidenceId: 'nope' }] }
  assert.match(validateProduct('p.json', p, ids).join(), /not in evidence.json/)
})

test('work needs an explicit consent flag', () => {
  const { consent, ...w } = work()
  assert.match(validateWork('w.json', w, ids).join(), /consent must be true or false/)
})

test('product work must keep its canonical page on zobique.com', () => {
  assert.match(validateWork('w.json', { ...work(), canonicalUrl: 'https://labs.zobique.com/x' }, ids).join(), /canonical page/)
})

test('evidence ids are unique and statuses are known', () => {
  const errs = validateEvidence('e.json', [
    { id: 'a', claim: 'c', status: 'verified' },
    { id: 'a', claim: 'c', status: 'maybe' },
  ]).join()
  assert.match(errs, /duplicate id/)
  assert.match(errs, /status must be one of/)
})

test('placeholders are found anywhere in the tree', () => {
  const hits = findPlaceholders({ 'site.json': { phone: '[PLACEHOLDER: phone]', nested: { list: ['ok', '[PLACEHOLDER]'] } } })
  assert.deepEqual(hits, ['site.json → phone', 'site.json → nested.list[1]'])
})

test('unverified references are reported, verified ones are not', () => {
  const evidence = [{ id: 'ncs', status: 'verified' }, { id: 'press', status: 'unverified' }]
  const refs = unverifiedReferences({ 'home.json': { a: { evidenceId: 'ncs' }, b: { evidenceId: 'press' } } }, evidence)
  assert.deepEqual([...refs.keys()], ['press'])
})

test('the real content folder is valid and has no placeholders', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'content')
  const files = loadContent(root)
  const { errors } = validateAll(files)
  assert.deepEqual(errors, [])
  assert.deepEqual(findPlaceholders(files), [])
})
