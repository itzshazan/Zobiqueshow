'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { track } from '@/lib/analytics'
import { CONTACT_LIMITS, validateContact, type ContactErrors } from '@/lib/contact-validation'

interface ContactFormProps {
  /** id of the visible heading that names this form */
  labelledBy: string
  reasons: { value: string; label: string }[]
  messages: { success: string; error: string; rateLimited: string }
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'rate-limited'

export default function ContactForm({ labelledBy, reasons, messages }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<ContactErrors>({})
  const statusRef = useRef<HTMLDivElement>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>

    // Same rules as the server; the server re-checks everything
    const found = validateContact(data, reasons.map((r) => r.value))
    setErrors(found)
    // Focus the first invalid field in form order (by id: aria-invalid isn't rendered yet)
    const firstInvalid = (['name', 'email', 'organisation', 'reason', 'message'] as const).find((k) => found[k])
    if (firstInvalid) {
      document.getElementById(`f-${firstInvalid}`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('sent')
        track({ name: 'contact_submit', reason: data.reason })
        form.reset()
      } else {
        setStatus(res.status === 429 ? 'rate-limited' : 'error')
      }
    } catch {
      setStatus('error')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const field = (name: keyof ContactErrors) => ({
    id: `f-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `f-${name}-err` : undefined,
  })
  const err = (name: keyof ContactErrors) =>
    errors[name] ? <span id={`f-${name}-err`} className="field-error">{errors[name]}</span> : null

  return (
    <form className="form" id="contact-form" onSubmit={onSubmit} noValidate aria-labelledby={labelledBy}>

      <div ref={statusRef} tabIndex={-1} aria-live="polite">
        {status === 'sent' && <p className="form-status ok">{messages.success}</p>}
        {status === 'error' && <p className="form-status err">{messages.error}</p>}
        {status === 'rate-limited' && <p className="form-status err">{messages.rateLimited}</p>}
      </div>

      <div className="field field-half">
        <label htmlFor="f-name">Name</label>
        <input {...field('name')} autoComplete="name" maxLength={CONTACT_LIMITS.name} required />
        {err('name')}
      </div>
      <div className="field field-half">
        <label htmlFor="f-email">Email</label>
        <input {...field('email')} type="email" autoComplete="email" maxLength={CONTACT_LIMITS.email} required />
        {err('email')}
      </div>
      <div className="field field-half">
        <label htmlFor="f-organisation">Organisation <span className="hint">(optional)</span></label>
        <input {...field('organisation')} autoComplete="organization" maxLength={CONTACT_LIMITS.organisation} />
        {err('organisation')}
      </div>
      <div className="field field-half">
        <label htmlFor="f-reason">Reason</label>
        <select {...field('reason')} defaultValue="" required>
          <option value="" disabled>Choose one</option>
          {reasons.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        {err('reason')}
      </div>
      <div className="field">
        <label htmlFor="f-message">Message</label>
        <textarea {...field('message')} maxLength={CONTACT_LIMITS.message} required />
        {err('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
