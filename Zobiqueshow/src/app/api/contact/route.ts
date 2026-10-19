import { NextResponse } from 'next/server'
import { cleanContact, validateContact } from '@/lib/contact-validation'
import contactJson from '../../../../content/pages/contact.json'
import siteJson from '../../../../content/site.json'

// Contact endpoint (brief section K.7): server-side validation, honeypot, rate limit,
// delivery to the canonical address in content/site.json.
//
// Environment:
//   RESEND_API_KEY   send mail through Resend (https://resend.com)
//   CONTACT_FROM     verified sender, e.g. "Zobique website <web@zobique.com>"
//   CONTACT_DRY_RUN  "1" to log instead of sending (local development and tests)
//   CONTACT_RATE_LIMIT  messages per IP per 10 minutes (default 5)

const REASONS = contactJson.form.reasons.map((r) => r.value)
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = Number(process.env.CONTACT_RATE_LIMIT) || 5

// Per-instance memory. Good enough for one server; on serverless or several
// instances, move this to a shared store (e.g. Upstash Redis).
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

// Header values must stay on one line (stops header injection through the subject)
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 150)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  if (rateLimited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })

  let raw: Record<string, unknown>
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object')
    raw = body as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  // Honeypot filled: answer as if it worked, send nothing
  if (typeof raw.website === 'string' && raw.website.trim() !== '') return NextResponse.json({ ok: true })

  const errors = validateContact(raw, REASONS)
  if (Object.keys(errors).length) return NextResponse.json({ error: 'invalid', fields: errors }, { status: 422 })

  const input = cleanContact(raw)
  const reasonLabel = contactJson.form.reasons.find((r) => r.value === input.reason)?.label ?? input.reason
  const subject = oneLine(`zobique.com: ${reasonLabel} — ${input.name}`)
  // Plain text only: nothing the visitor typed is ever interpreted as HTML
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Organisation: ${input.organisation || '—'}`,
    `Reason: ${reasonLabel}`,
    '',
    input.message,
  ].join('\n')

  if (process.env.CONTACT_DRY_RUN === '1') {
    console.info('[contact] dry run', { to: siteJson.email, subject })
    return NextResponse.json({ ok: true, dryRun: true })
  }

  const key = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM
  if (!key || !from) {
    console.error('[contact] RESEND_API_KEY or CONTACT_FROM is not set; message not sent')
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [siteJson.email], reply_to: input.email, subject, text }),
    })
    if (!res.ok) {
      console.error('[contact] Resend error', res.status, await res.text())
      return NextResponse.json({ error: 'send_failed' }, { status: 502 })
    }
  } catch (e) {
    console.error('[contact] Resend request failed', e)
    return NextResponse.json({ error: 'send_failed' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
